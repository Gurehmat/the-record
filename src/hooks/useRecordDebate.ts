import { useCallback, useEffect, useRef, useState } from 'react'

import { factCheckClaim } from '../lib/factcheck'
import { generateGeminiText, isRateLimitError } from '../lib/gemini'
import { useDebateStore } from '../store/useDebateStore'
import type { FactualClaim, RecordSpeakerId } from '../types'

const ANALYSIS_DEBOUNCE_MS = 2_000
const FACT_CHECK_START_DELAY_MS = 3_000
const FACT_CHECK_BETWEEN_CLAIMS_DELAY_MS = 2_000

type AnalysisFallacy = {
  type: string
  quote: string
  explanation: string
}

type AnalysisResult = {
  fallacies: AnalysisFallacy[]
  factualClaims: FactualClaim[]
}

type PendingAnalysisItem = {
  messageIds: string[]
  text: string
  speaker: string
  speakerId: RecordSpeakerId
  timestamp: number
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function parseJsonObject(rawText: string): Record<string, unknown> | null {
  const trimmed = rawText.trim()
  if (!trimmed) {
    return null
  }

  const stripped = trimmed
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim()

  const firstBrace = stripped.indexOf('{')
  const lastBrace = stripped.lastIndexOf('}')
  const candidate =
    firstBrace >= 0 && lastBrace > firstBrace
      ? stripped.slice(firstBrace, lastBrace + 1)
      : stripped

  try {
    const parsed: unknown = JSON.parse(candidate)
    return typeof parsed === 'object' && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

function toAnalysisResult(rawText: string): AnalysisResult {
  const parsed = parseJsonObject(rawText)
  if (!parsed) {
    return {
      fallacies: [],
      factualClaims: [],
    }
  }

  const fallacies: AnalysisFallacy[] = Array.isArray(parsed.fallacies)
    ? parsed.fallacies
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return null
          }

          const value = item as Record<string, unknown>
          if (
            typeof value.type !== 'string' ||
            typeof value.quote !== 'string' ||
            typeof value.explanation !== 'string'
          ) {
            return null
          }

          return {
            type: value.type.trim(),
            quote: value.quote.trim(),
            explanation: value.explanation.trim(),
          }
        })
        .filter((item): item is AnalysisFallacy => {
          return item !== null && item.type.length > 0 && item.explanation.length > 0
        })
    : []

  const factualClaims: FactualClaim[] = Array.isArray(parsed.factualClaims)
    ? parsed.factualClaims
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return null
          }

          const value = item as Record<string, unknown>
          if (typeof value.claim !== 'string' || typeof value.context !== 'string') {
            return null
          }

          return {
            claim: value.claim.trim(),
            context: value.context.trim(),
          }
        })
        .filter((item): item is FactualClaim => {
          return item !== null && item.claim.length > 0
        })
    : []

  return {
    fallacies,
    factualClaims,
  }
}

async function analyzeStatement(text: string, speaker: string) {
  const prompt = `You are a debate referee analyzing a live debate.

Speaker: ${speaker}
Statement: "${text}"

Analyze this statement for:
1. Logical fallacies
2. Factual claims that can be verified

Respond in JSON only:
{
  "fallacies": [
    {"type": "FALLACY NAME", "quote": "relevant quote", "explanation": "brief explanation"}
  ],
  "factualClaims": [
    {"claim": "the specific claim", "context": "what domain"}
  ]
}

If no fallacies found, return empty arrays. Be strict - only flag clear logical fallacies, not just bad arguments.`

  const response = await generateGeminiText({
    contents: [
      {
        role: 'user',
        text: prompt,
      },
    ],
  })

  if (!response || response.startsWith('ERROR:')) {
    return {
      fallacies: [],
      factualClaims: [],
    }
  }

  return toAnalysisResult(response)
}

export function useRecordDebate() {
  const activeSpeaker = useDebateStore((state) => state.activeSpeaker)
  const isRecording = useDebateStore((state) => state.isRecording)
  const setActiveSpeakerInStore = useDebateStore((state) => state.setActiveSpeaker)
  const setIsRecording = useDebateStore((state) => state.setIsRecording)
  const setRecordStopHandler = useDebateStore((state) => state.setRecordStopHandler)
  const [interimText, setInterimText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const currentTranscriptRef = useRef('')
  const micStreamRef = useRef<MediaStream | null>(null)
  const isRecordingRef = useRef(isRecording)
  const isRecognitionRunningRef = useRef(false)
  const analysisTimerRef = useRef<number | null>(null)
  const pendingAnalysisRef = useRef<PendingAnalysisItem[]>([])
  const factCheckQueueRef = useRef<Array<FactualClaim & { speaker: string }>>([])
  const isFactCheckingRef = useRef(false)

  useEffect(() => {
    isRecordingRef.current = isRecording
  }, [isRecording])

  const runFactCheckQueue = useCallback(async () => {
    if (isFactCheckingRef.current) {
      return
    }

    isFactCheckingRef.current = true
    await sleep(FACT_CHECK_START_DELAY_MS)

    while (factCheckQueueRef.current.length > 0) {
      const nextClaim = factCheckQueueRef.current.shift()
      if (!nextClaim) {
        continue
      }

      const pendingId = createId('factcheck')
      const state = useDebateStore.getState()

      state.addFactCheck({
        id: pendingId,
        claim: nextClaim.claim,
        verdict: 'unverifiable',
        explanation: 'Checking claim against web sources...',
        sources: [],
        timestamp: Date.now(),
        status: 'pending',
        speaker: nextClaim.speaker,
      })

      const result = await factCheckClaim(nextClaim.claim, nextClaim.context)

      useDebateStore.getState().updateFactCheck(pendingId, {
        verdict: result.verdict,
        explanation: result.explanation,
        sources: result.sources,
        status: 'complete',
        speaker: nextClaim.speaker,
      })

      await sleep(FACT_CHECK_BETWEEN_CLAIMS_DELAY_MS)
    }

    isFactCheckingRef.current = false
  }, [])

  const queueFactualClaims = useCallback(
    (factualClaims: FactualClaim[], speaker: string) => {
      if (factualClaims.length === 0) {
        return
      }

      useDebateStore.getState().addFactualClaims(factualClaims)
      factCheckQueueRef.current.push(
        ...factualClaims.map((factualClaim) => ({
          ...factualClaim,
          speaker,
        })),
      )
      void runFactCheckQueue()
    },
    [runFactCheckQueue],
  )

  const runAnalysis = useCallback(
    async (items: PendingAnalysisItem[]) => {
      for (const item of items) {
        try {
          const result = await analyzeStatement(item.text, item.speaker)
          const state = useDebateStore.getState()
          const detectedFallacies = result.fallacies.map((fallacy, index) => ({
            id: createId('fallacy'),
            type: fallacy.type,
            description: fallacy.explanation,
            quote: fallacy.quote,
            speaker: item.speaker,
            severity: 'medium' as const,
            timestamp: item.timestamp + index,
          }))

          detectedFallacies.forEach((fallacy) => {
            state.addFallacy(fallacy)
          })

          if (detectedFallacies.length > 0) {
            item.messageIds.forEach((messageId) => {
              state.flagMessage(messageId)
            })
            state.showFallacyModal(detectedFallacies[0])
          }

          queueFactualClaims(result.factualClaims, item.speaker)
        } catch (err: unknown) {
          const state = useDebateStore.getState()
          if (isRateLimitError(err)) {
            state.addMessage({
              id: createId('system-analysis'),
              role: 'system',
              content: 'ANALYSIS RATE LIMITED - PROCEEDINGS CONTINUE',
              timestamp: Date.now(),
            })
          } else {
            console.error('Record analysis error:', err)
          }
        }
      }
    },
    [queueFactualClaims],
  )

  const queueAnalysis = useCallback(
    (
      messageId: string,
      text: string,
      speaker: string,
      speakerId: RecordSpeakerId,
    ) => {
      pendingAnalysisRef.current.push({
        messageIds: [messageId],
        text,
        speaker,
        speakerId,
        timestamp: Date.now(),
      })

      if (analysisTimerRef.current !== null) {
        window.clearTimeout(analysisTimerRef.current)
      }

      analysisTimerRef.current = window.setTimeout(() => {
        const pendingItems = pendingAnalysisRef.current
        pendingAnalysisRef.current = []
        analysisTimerRef.current = null

        const groupedItems = pendingItems.reduce<PendingAnalysisItem[]>(
          (groups, item) => {
            const previous = groups[groups.length - 1]
            if (previous && previous.speakerId === item.speakerId) {
              previous.messageIds.push(...item.messageIds)
              previous.text = `${previous.text} ${item.text}`.trim()
              previous.timestamp = item.timestamp
              return groups
            }

            groups.push({ ...item })
            return groups
          },
          [],
        )

        void runAnalysis(groupedItems)
      }, ANALYSIS_DEBOUNCE_MS)
    },
    [runAnalysis],
  )

  const ensureRecognition = useCallback(() => {
    if (recognitionRef.current) {
      return recognitionRef.current
    }

    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionConstructor) {
      setError('SPEECH RECOGNITION NOT SUPPORTED')
      return null
    }

    const recognition = new SpeechRecognitionConstructor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript
        if (event.results[index].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      currentTranscriptRef.current = interimTranscript
      setInterimText(interimTranscript.trim())

      const finalText = finalTranscript.trim()
      if (!finalText) {
        return
      }

      const state = useDebateStore.getState()
      const speakerId = state.activeSpeaker
      const speakerName =
        speakerId === 'speaker1'
          ? state.config.speaker1.trim() || 'Speaker A'
          : state.config.speaker2.trim() || 'Speaker B'

      const messageId = createId('record-message')

      state.addMessage({
        id: messageId,
        role: speakerId === 'speaker1' ? 'user' : 'philosopher',
        content: finalText,
        timestamp: Date.now(),
        speaker: speakerName,
        speakerId,
      })

      queueAnalysis(messageId, finalText, speakerName, speakerId)
      currentTranscriptRef.current = ''
      setInterimText('')
    }

    recognition.onend = () => {
      isRecognitionRunningRef.current = false
      if (isRecordingRef.current) {
        try {
          recognition.start()
          isRecognitionRunningRef.current = true
        } catch {
          // Web Speech can throw if Chrome is still closing the previous session.
        }
      }
    }

    recognition.onerror = (event) => {
      console.error('Record speech error:', event.error)
      isRecognitionRunningRef.current = false

      if (event.error === 'no-speech') {
        return
      }

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('MICROPHONE ACCESS DENIED')
        isRecordingRef.current = false
        setIsRecording(false)
        return
      }

      setError(`SPEECH RECOGNITION ERROR: ${event.error.toUpperCase()}`)
    }

    recognitionRef.current = recognition
    return recognition
  }, [queueAnalysis, setIsRecording])

  const startRecording = useCallback(async () => {
    setError(null)

    const recognition = ensureRecognition()
    if (!recognition) {
      isRecordingRef.current = false
      setIsRecording(false)
      return
    }

    if (navigator.mediaDevices?.getUserMedia && !micStreamRef.current) {
      try {
        micStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
      } catch {
        setError('MICROPHONE ACCESS DENIED')
        isRecordingRef.current = false
        setIsRecording(false)
        return
      }
    }

    isRecordingRef.current = true
    setIsRecording(true)

    if (isRecognitionRunningRef.current) {
      return
    }

    try {
      recognition.start()
      isRecognitionRunningRef.current = true
    } catch {
      // Ignore duplicate start calls from rapid resume/autorestart cycles.
    }
  }, [ensureRecognition, setIsRecording])

  const pauseRecording = useCallback(() => {
    isRecordingRef.current = false
    setIsRecording(false)
    currentTranscriptRef.current = ''
    setInterimText('')

    try {
      recognitionRef.current?.stop()
    } catch {
      // stop() can throw if recognition never started.
    }
  }, [setIsRecording])

  const resumeRecording = useCallback(() => {
    void startRecording()
  }, [startRecording])

  const stopRecording = useCallback(() => {
    isRecordingRef.current = false
    setIsRecording(false)
    currentTranscriptRef.current = ''
    setInterimText('')

    if (analysisTimerRef.current !== null) {
      window.clearTimeout(analysisTimerRef.current)
      analysisTimerRef.current = null
    }
    pendingAnalysisRef.current = []

    try {
      recognitionRef.current?.stop()
    } catch {
      // stop() can throw if recognition never started.
    }

    recognitionRef.current = null
    isRecognitionRunningRef.current = false

    micStreamRef.current?.getTracks().forEach((track) => track.stop())
    micStreamRef.current = null
  }, [setIsRecording])

  const setActiveSpeaker = useCallback(
    (speaker: RecordSpeakerId) => {
      setActiveSpeakerInStore(speaker)
    },
    [setActiveSpeakerInStore],
  )

  useEffect(() => {
    setRecordStopHandler(stopRecording)

    return () => {
      setRecordStopHandler(null)
      stopRecording()
    }
  }, [setRecordStopHandler, stopRecording])

  return {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    isRecording,
    isPaused: !isRecording,
    interimText,
    error,
    activeSpeaker,
    setActiveSpeaker,
  }
}
