import { useEffect, useRef, useState } from 'react'
import { Keyboard, Mic } from 'lucide-react'

import { useDebate } from '../../hooks/useDebate'
import { useDebateStore } from '../../store/useDebateStore'

type VoiceInputBarProps = {
  switchButtonClassName: string
}

export function VoiceInputBar({ switchButtonClassName }: VoiceInputBarProps) {
  const { sendMessage, isLoading } = useDebate()
  const isPhilosopherSpeaking = useDebateStore((state) => state.isPhilosopherSpeaking)
  const activeFallacyModal = useDebateStore((state) => state.activeFallacyModal)
  const setConfig = useDebateStore((state) => state.setConfig)
  const setDebateState = useDebateStore((state) => state.setDebateState)
  const isInputDisabled = isLoading || isPhilosopherSpeaking || Boolean(activeFallacyModal)
  const speechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const finalTextRef = useRef('')
  const clearErrorTimeoutRef = useRef<number | null>(null)
  const retryStartTimeoutRef = useRef<number | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported] = useState(Boolean(speechRecognitionConstructor))
  const [interimText, setInterimText] = useState('')
  const [finalText, setFinalText] = useState('')
  const [error, setError] = useState(isSupported ? '' : 'VOICE NOT SUPPORTED')
  const [showEndConfirm, setShowEndConfirm] = useState(false)

  useEffect(() => {
    finalTextRef.current = finalText
  }, [finalText])

  useEffect(() => {
    const SR = speechRecognitionConstructor
    if (!SR) {
      return
    }

    const recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = ''

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript
      }

      const trimmedTranscript = transcript.trim()
      setInterimText(trimmedTranscript)

      if (event.results[event.results.length - 1]?.isFinal) {
        setFinalText(transcript)
        finalTextRef.current = transcript
      }
    }

    recognition.onend = () => {
      setIsRecording(false)
      const finalTranscript = finalTextRef.current.trim()

      if (finalTranscript) {
        void sendMessage(finalTranscript)
        setFinalText('')
        setInterimText('')
        finalTextRef.current = ''
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech error:', event.error)
      setIsRecording(false)

      if (clearErrorTimeoutRef.current) {
        window.clearTimeout(clearErrorTimeoutRef.current)
      }

      if (event.error === 'not-allowed') {
        setError('MICROPHONE ACCESS DENIED')
        return
      }

      if (event.error === 'no-speech') {
        setError('NO SPEECH DETECTED')
      } else {
        setError(`VOICE ERROR: ${event.error}`)
      }

      clearErrorTimeoutRef.current = window.setTimeout(() => {
        setError('')
        clearErrorTimeoutRef.current = null
      }, 2000)
    }

    recognitionRef.current = recognition

    return () => {
      if (clearErrorTimeoutRef.current) {
        window.clearTimeout(clearErrorTimeoutRef.current)
      }
      if (retryStartTimeoutRef.current) {
        window.clearTimeout(retryStartTimeoutRef.current)
      }
      recognition.abort()
      recognitionRef.current = null
    }
  }, [sendMessage, speechRecognitionConstructor])

  useEffect(() => {
    if (!isInputDisabled || !isRecording) {
      return
    }

    recognitionRef.current?.stop()
  }, [isInputDisabled, isRecording])

  const handleToggleRecording = () => {
    if (isInputDisabled || !recognitionRef.current) {
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      return
    }

    setError('')
    setInterimText('')
    setFinalText('')
    finalTextRef.current = ''

    try {
      recognitionRef.current.start()
      setIsRecording(true)
    } catch (startError) {
      console.error('Failed to start recognition:', startError)
      recognitionRef.current.abort()

      retryStartTimeoutRef.current = window.setTimeout(() => {
        try {
          recognitionRef.current?.start()
          setIsRecording(true)
        } catch (retryError) {
          console.error('Failed to restart recognition:', retryError)
          setIsRecording(false)
          setError('FAILED TO START RECORDING')
        }
      }, 100)
    }
  }

  const handleSwitchToText = () => {
    recognitionRef.current?.abort()
    setIsRecording(false)
    setConfig({ inputMode: 'text' })
  }

  const disabledMessage = activeFallacyModal
    ? 'PROCEEDINGS PAUSED - RESOLVE FALLACY FLAG...'
    : isPhilosopherSpeaking
      ? 'PHILOSOPHER SPEAKING...'
      : isLoading
        ? 'GENERATING RESPONSE...'
        : ''

  const buttonText = !isSupported
    ? 'VOICE NOT SUPPORTED'
    : isInputDisabled
      ? disabledMessage || 'VOICE INPUT DISABLED'
      : isRecording
        ? 'RECORDING...'
        : 'CLICK TO SPEAK'
  const previewMessage = error || interimText || finalText
  const isButtonDisabled = isInputDisabled || !isSupported

  const endSessionControl = showEndConfirm ? (
    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
      <span className="text-accent">END PROCEEDINGS?</span>
      <button
        type="button"
        onClick={() => {
          recognitionRef.current?.abort()
          setIsRecording(false)
          setDebateState('verdict')
        }}
        className="bg-accent px-2 py-1 text-white"
      >
        CONFIRM
      </button>
      <button
        type="button"
        onClick={() => setShowEndConfirm(false)}
        className="text-accent underline underline-offset-4"
      >
        CANCEL
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => setShowEndConfirm(true)}
      className="self-start font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent underline-offset-4 hover:underline"
    >
      END SESSION
    </button>
  )

  return (
    <div className="flex flex-col gap-3">
      {endSessionControl}
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-4">
      <button type="button" onClick={handleSwitchToText} className={switchButtonClassName}>
        <Keyboard className="h-4 w-4" strokeWidth={3} />
        SWITCH TO TEXT
      </button>

      <div className="relative min-w-0 flex-1">
        {previewMessage && (
          <div
            className={`absolute bottom-[calc(100%+8px)] left-0 max-w-full whitespace-normal wrap-break-word border-2 border-ink bg-parchment px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] shadow-[3px_3px_0_0_#1A1A1A] sm:truncate ${
              error ? 'text-accent' : 'text-ink/80'
            }`}
          >
            {previewMessage}
          </div>
        )}

        <button
          type="button"
          disabled={isButtonDisabled}
          onClick={handleToggleRecording}
          className={`flex h-[52px] w-full items-center justify-between border-[3px] border-ink px-3 font-mono text-[11px] font-bold uppercase tracking-[0.04em] text-white shadow-brutal transition-all duration-100 sm:px-4 sm:text-sm sm:tracking-[0.08em] ${
            isRecording
              ? 'voice-recording-pulse bg-accent'
              : 'bg-accent hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none'
          } ${
            isButtonDisabled
              ? 'cursor-not-allowed bg-[#8A1224] text-white/85 shadow-none hover:translate-x-0 hover:translate-y-0'
              : ''
          }`}
        >
          <span className="min-w-0 truncate">{buttonText}</span>
          <Mic className="h-5 w-5 shrink-0" strokeWidth={3} />
        </button>
      </div>
    </div>
    </div>
  )
}
