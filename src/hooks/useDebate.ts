import { useCallback } from 'react'

import { speakText } from '../lib/audio'
import { getPhilosopherResponse } from '../lib/debate'
import { factCheckClaim } from '../lib/factcheck'
import { isRateLimitError } from '../lib/gemini'
import { useDebateStore } from '../store/useDebateStore'

const FACT_CHECK_START_DELAY_MS = 3_000
const FACT_CHECK_BETWEEN_CLAIMS_DELAY_MS = 2_000

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function useDebate() {
  const isLoading = useDebateStore((state) => state.isLoading)

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) {
      return
    }

    const initialState = useDebateStore.getState()
    if (initialState.isLoading || initialState.activeFallacyModal) {
      return
    }

    const now = Date.now()
    const userMessage = {
      id: `user-${now}`,
      role: 'user' as const,
      content: trimmed,
      timestamp: now,
    }

    initialState.addMessage(userMessage)

    const philosopher = initialState.config.philosopher
    if (!philosopher) {
      initialState.addMessage({
        id: `system-${Date.now()}`,
        role: 'system',
        content: 'CONNECTION LOST - RETRY',
        timestamp: Date.now(),
      })
      return
    }

    initialState.setIsLoading(true)
    const conversationMessages = useDebateStore.getState().messages
    const topic = initialState.config.topic

    try {
      const response = await getPhilosopherResponse(
        conversationMessages,
        philosopher,
        topic,
      )

      const state = useDebateStore.getState()
      const responseTimestamp = Date.now()

      state.addMessage({
        id: `philosopher-${responseTimestamp}`,
        role: 'philosopher',
        content: response.response,
        timestamp: responseTimestamp,
      })

      void (async () => {
        const speakingState = useDebateStore.getState()
        speakingState.setIsPhilosopherSpeaking(true)

        try {
          await speakText(response.response, philosopher.voiceId)
        } catch {
          // Audio playback failures should not interrupt the debate flow.
        } finally {
          useDebateStore.getState().setIsPhilosopherSpeaking(false)
        }
      })()

      const speaker = state.config.speaker1.trim() || 'PARTICIPANT_01'
      const detectedFallacies = response.fallacies.map((fallacy, index) => ({
        id: `fallacy-${responseTimestamp}-${index}`,
        type: fallacy.type,
        description: fallacy.explanation,
        quote: fallacy.quote,
        speaker,
        severity: 'medium' as const,
        timestamp: responseTimestamp + index,
      }))

      detectedFallacies.forEach((fallacy) => {
        state.addFallacy(fallacy)
      })

      if (detectedFallacies.length > 0) {
        state.showFallacyModal(detectedFallacies[0])
      }

      if (response.factualClaims.length > 0) {
        state.addFactualClaims(response.factualClaims)
        const factCheckSpeaker = state.config.speaker1.trim() || 'PARTICIPANT_01'
        const pendingFactChecks = response.factualClaims.map((factualClaim, index) => {
          const pendingId = `factcheck-${responseTimestamp}-${index}`

          state.addFactCheck({
            id: pendingId,
            claim: factualClaim.claim,
            verdict: 'unverifiable',
            explanation: 'Checking claim against web sources...',
            sources: [],
            timestamp: responseTimestamp + index,
            status: 'pending',
            speaker: factCheckSpeaker,
          })

          return { pendingId, factualClaim }
        })

        void (async () => {
          await sleep(FACT_CHECK_START_DELAY_MS)

          for (const { pendingId, factualClaim } of pendingFactChecks) {
            const result = await factCheckClaim(factualClaim.claim, factualClaim.context)

            useDebateStore.getState().updateFactCheck(pendingId, {
              verdict: result.verdict,
              explanation: result.explanation,
              sources: result.sources,
              status: 'complete',
            })

            await sleep(FACT_CHECK_BETWEEN_CLAIMS_DELAY_MS)
          }
        })()
      }
    } catch (err: unknown) {
      const state = useDebateStore.getState()
      state.addMessage({
        id: `system-${Date.now()}`,
        role: 'system',
        content: isRateLimitError(err)
          ? 'RATE LIMITED  WAIT A MOMENT'
          : 'CONNECTION LOST - RETRY',
        timestamp: Date.now(),
      })
    } finally {
      const state = useDebateStore.getState()
      state.setIsLoading(false)
    }
  }, [])

  return {
    sendMessage,
    isLoading,
  }
}
