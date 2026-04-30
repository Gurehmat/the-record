import { useState } from 'react'
import { Mic, Send } from 'lucide-react'

import { useDebate } from '../../hooks/useDebate'
import { useDebateStore } from '../../store/useDebateStore'
import { ForumInputShell } from './ForumInputShell'
import { VoiceInputBar } from './VoiceInputBar'

const modeSwitchButtonClass =
  'inline-flex h-[52px] shrink-0 items-center gap-2 border-[3px] border-ink bg-parchment px-3 font-mono text-[11px] font-bold uppercase tracking-[0.04em] text-ink shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none sm:gap-3 sm:px-5 sm:text-sm sm:tracking-[0.08em]'

export function InputBar() {
  const { sendMessage, isLoading } = useDebate()
  const isPhilosopherSpeaking = useDebateStore((state) => state.isPhilosopherSpeaking)
  const activeFallacyModal = useDebateStore((state) => state.activeFallacyModal)
  const userName = useDebateStore((state) => state.config.speaker1.trim() || 'PARTICIPANT_01')
  const inputMode = useDebateStore((state) => state.config.inputMode)
  const setConfig = useDebateStore((state) => state.setConfig)
  const setDebateState = useDebateStore((state) => state.setDebateState)
  const [draft, setDraft] = useState('')
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const isInputDisabled = isLoading || isPhilosopherSpeaking || Boolean(activeFallacyModal)
  const endSessionControl = showEndConfirm ? (
    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
      <span className="text-accent">END PROCEEDINGS?</span>
      <button
        type="button"
        onClick={() => setDebateState('verdict')}
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

  if (inputMode === 'voice') {
    return (
      <ForumInputShell>
        <div className="flex flex-col gap-3">
          <VoiceInputBar switchButtonClassName={modeSwitchButtonClass} />
        </div>
      </ForumInputShell>
    )
  }

  const handleSubmit = async () => {
    const trimmed = draft.trim()
    if (!trimmed || isInputDisabled) {
      return
    }

    await sendMessage(trimmed)
    setDraft('')
  }

  return (
    <ForumInputShell>
      <div className="flex flex-col gap-3">
        {endSessionControl}
        <form
          className="flex items-center gap-2 sm:gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            void handleSubmit()
          }}
        >
          <button
            type="button"
            onClick={() => setConfig({ inputMode: 'voice' })}
            className={modeSwitchButtonClass}
          >
            <Mic className="h-4 w-4" strokeWidth={3} />
            SWITCH TO VOICE
          </button>

          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={
              activeFallacyModal
                ? 'PROCEEDINGS PAUSED - RESOLVE FALLACY FLAG...'
                : isPhilosopherSpeaking
                  ? 'PHILOSOPHER SPEAKING...'
                  : 'TYPE YOUR ARGUMENT...'
            }
            disabled={isInputDisabled}
            aria-label={`Message input for ${userName}`}
            className="h-[52px] min-w-0 flex-1 border-[3px] border-ink bg-parchment px-3 font-mono text-[11px] uppercase tracking-[0.04em] text-ink outline-none placeholder:text-[#6B7280] focus:border-accent disabled:cursor-not-allowed disabled:bg-[#E8E3D9] disabled:text-ink/60 sm:px-4 sm:text-sm sm:tracking-[0.08em]"
          />

          <button
            type="submit"
            disabled={isInputDisabled}
            className="inline-flex h-[52px] shrink-0 items-center gap-2 border-[3px] border-ink bg-ink px-4 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:bg-ink/70 sm:gap-3 sm:px-6 sm:text-sm sm:tracking-widest"
          >
            SUBMIT
            <Send className="h-4 w-4" strokeWidth={3} />
          </button>
        </form>
      </div>
    </ForumInputShell>
  )
}
