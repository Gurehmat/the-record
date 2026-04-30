import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Mic, MicOff, ShieldCheck } from 'lucide-react'

import type { RecordTranscriptMessage } from './recordTypes'

type SpeakerColumnProps = {
  speakerName: string
  isActive: boolean
  messages: RecordTranscriptMessage[]
  credibilityScore: number
  interimText?: string
}

const RECORD_WAVE_BARS = [
  { duration: '0.3s', delay: '0ms' },
  { duration: '0.5s', delay: '70ms' },
  { duration: '0.4s', delay: '140ms' },
  { duration: '0.6s', delay: '45ms' },
  { duration: '0.35s', delay: '115ms' },
]

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function AudioWaveform({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex h-16 items-end gap-2 border-b-[3px] border-ink pb-3">
      {RECORD_WAVE_BARS.map((bar, index) => (
        <span
          key={`${bar.duration}-${index}`}
          className="record-wave-bar w-3 bg-accent"
          data-active={isActive}
          style={{
            '--record-wave-duration': bar.duration,
            '--record-wave-delay': bar.delay,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}

export function SpeakerColumn({
  speakerName,
  isActive,
  messages,
  credibilityScore,
  interimText = '',
}: SpeakerColumnProps) {
  const hasInterimText = interimText.trim().length > 0
  const latestMessageId = messages.at(-1)?.id
  const previousScoreRef = useRef(credibilityScore)
  const [scoreChanged, setScoreChanged] = useState(false)

  useEffect(() => {
    if (previousScoreRef.current === credibilityScore) {
      return undefined
    }

    previousScoreRef.current = credibilityScore
    setScoreChanged(true)

    const timeoutId = window.setTimeout(() => {
      setScoreChanged(false)
    }, 700)

    return () => window.clearTimeout(timeoutId)
  }, [credibilityScore])

  return (
    <section className="flex min-h-[280px] flex-1 flex-col border-[3px] border-ink bg-parchment shadow-brutal lg:min-h-0">
      <header className="flex items-start justify-between gap-3 border-b-[3px] border-ink px-5 py-3">
        <h2 className="flex-1 whitespace-normal wrap-break-word font-display text-2xl font-bold uppercase leading-tight tracking-[0.14em] text-ink">
          {speakerName}
        </h2>
        <div
          className={`flex shrink-0 items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] ${
            isActive ? 'text-verified' : 'text-ink/45'
          }`}
        >
          <span
            className={`h-2.5 w-2.5 border border-ink ${
              isActive ? 'bg-verified' : 'bg-ink/25'
            }`}
          />
          {isActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          <span>{isActive ? 'Active' : 'Standby'}</span>
        </div>
      </header>

      <div className="shrink-0 px-5 pt-4">
        <AudioWaveform isActive={isActive} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2">
        {messages.length === 0 && !hasInterimText ? (
          <div className="flex items-center justify-center border-2 border-dashed border-ink/35 bg-[#EFEFEF] px-3 py-2">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink/50">
              Awaiting transcript...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`border-l-4 px-3 py-2 font-mono text-sm leading-relaxed text-ink ${
                  message.isFlagged
                    ? 'border-warning bg-[#FFFBEB] font-semibold'
                    : message.id === latestMessageId
                      ? 'border-ink/45 bg-[#F8F6F0] font-semibold'
                      : 'border-transparent bg-transparent'
                }`}
              >
                <span className="font-bold text-ink/45">
                  [{formatTimestamp(message.timestamp)}]
                </span>{' '}
                {message.content}
              </article>
            ))}
            {hasInterimText ? (
              <article className="border-l-4 border-ink/25 bg-[#EFEFEF] px-3 py-2 font-mono text-sm italic leading-relaxed text-ink/50">
                {interimText}
              </article>
            ) : null}
          </div>
        )}
      </div>

      <footer className="flex shrink-0 justify-end px-5 pb-3">
        <div
          className={`inline-flex items-center gap-2 border-[3px] border-ink px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.18em] ${
            isActive ? 'bg-ink text-white' : 'bg-parchment text-ink'
          } ${scoreChanged ? 'record-score-flash' : ''}`}
        >
          <ShieldCheck className="h-4 w-4" strokeWidth={2.6} />
          Credibility Score: {credibilityScore}%
        </div>
      </footer>
    </section>
  )
}
