import { Pause, Play, UserRound } from 'lucide-react'

import { useDebateStore } from '../../store/useDebateStore'
import type { RecordSpeakerId } from '../../types'

type SpeakerToggleProps = {
  activeSpeaker: RecordSpeakerId
  isRecording: boolean
  onSelectSpeaker: (speaker: RecordSpeakerId) => void
  onPauseRecording: () => void
  onResumeRecording: () => void
}

export function SpeakerToggle({
  activeSpeaker,
  isRecording,
  onSelectSpeaker,
  onPauseRecording,
  onResumeRecording,
}: SpeakerToggleProps) {
  const speakerAName = useDebateStore((state) => state.config.speaker1.trim() || 'Speaker A')
  const speakerBName = useDebateStore((state) => state.config.speaker2.trim() || 'Speaker B')

  const speakerButtonClass = (speaker: 'speaker1' | 'speaker2') =>
    `inline-flex min-w-[12rem] flex-[1_1_12rem] items-center justify-center gap-1 border-[3px] border-ink px-2 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.08em] shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none sm:gap-2 sm:px-4 sm:text-xs sm:tracking-[0.16em] ${
      activeSpeaker === speaker && isRecording
        ? 'bg-accent text-white'
        : 'bg-parchment text-ink'
    }`

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-shrink-0 flex-wrap items-stretch justify-center gap-2 py-3 sm:gap-3">
      <button
        type="button"
        onClick={() => onSelectSpeaker('speaker1')}
        className={speakerButtonClass('speaker1')}
      >
        <UserRound className="h-4 w-4 flex-shrink-0" strokeWidth={2.8} />
        <span className="min-w-0 whitespace-normal break-words text-center leading-tight">
          {speakerAName}
        </span>
      </button>

      <button
        type="button"
        onClick={isRecording ? onPauseRecording : onResumeRecording}
        className={`inline-flex flex-shrink-0 items-center justify-center gap-1 border-[3px] border-ink px-3 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.08em] shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none sm:gap-2 sm:px-5 sm:text-xs sm:tracking-[0.16em] ${
          isRecording ? 'bg-ink text-white' : 'bg-parchment text-ink'
        }`}
      >
        {isRecording ? (
          <Pause className="h-4 w-4" strokeWidth={2.8} />
        ) : (
          <Play className="h-4 w-4" strokeWidth={2.8} />
        )}
        {isRecording ? 'Pause' : 'Resume'}
      </button>

      <button
        type="button"
        onClick={() => onSelectSpeaker('speaker2')}
        className={speakerButtonClass('speaker2')}
      >
        <UserRound className="h-4 w-4 flex-shrink-0" strokeWidth={2.8} />
        <span className="min-w-0 whitespace-normal break-words text-center leading-tight">
          {speakerBName}
        </span>
      </button>
    </div>
  )
}
