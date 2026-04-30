import { useEffect, useMemo, useRef } from 'react'

import type { Message } from '../../types'
import { useDebateStore } from '../../store/useDebateStore'

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function WaveformIndicator() {
  const barHeights = ['h-2', 'h-5', 'h-3', 'h-6', 'h-4']

  return (
    <div className="mt-2 flex items-end gap-1.5" aria-label="Philosopher speaking">
      {barHeights.map((heightClass, index) => (
        <span
          key={`wave-${heightClass}-${index}`}
          className={`tts-wave-bar ${heightClass} w-1 bg-accent`}
          style={{ animationDelay: `${index * 90}ms` }}
        />
      ))}
    </div>
  )
}

function MessageRow({
  message,
  userLabel,
  philosopherLabel,
  isLatestPhilosopher,
  showWaveform,
}: {
  message: Message
  userLabel: string
  philosopherLabel: string
  isLatestPhilosopher: boolean
  showWaveform: boolean
}) {
  const speakerLabel =
    message.role === 'user'
      ? userLabel
      : message.role === 'philosopher'
        ? philosopherLabel
        : 'SYSTEM'

  const isPhilosopher = message.role === 'philosopher'
  const isUser = message.role === 'user'

  return (
    <article
      className={`border-l-4 px-3 py-3 md:px-4 ${
        isUser
          ? 'border-accent bg-transparent'
          : isPhilosopher
            ? isLatestPhilosopher
              ? 'border-ink bg-[#F5F1C8]'
              : 'border-ink bg-[#FFFBEB]'
            : 'border-ink bg-parchment'
      }`}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2 md:gap-4">
        <span className="shrink-0 border border-ink/25 bg-parchment px-2 py-1 font-mono text-[10px] font-semibold text-[#6B7280] md:text-xs">
          [{formatTimestamp(message.timestamp)}]
        </span>
        <span className="min-w-0 wrap-break-word font-mono text-sm font-bold uppercase tracking-[0.06em] text-ink md:text-[1.65rem] md:tracking-[0.08em]">
          {speakerLabel}
        </span>
      </div>
      {showWaveform && <WaveformIndicator />}
      <p className="mt-2 wrap-break-word font-mono text-sm leading-relaxed text-ink md:text-[2rem] md:leading-[1.55]">
        {message.content}
      </p>
    </article>
  )
}

export function ChatArea() {
  const messages = useDebateStore((state) => state.messages)
  const isLoading = useDebateStore((state) => state.isLoading)
  const isPhilosopherSpeaking = useDebateStore((state) => state.isPhilosopherSpeaking)
  const userLabel = useDebateStore((state) => state.config.speaker1.trim() || 'PARTICIPANT_01')
  const philosopherLabel = useDebateStore((state) => state.config.philosopher?.name || 'SOCRATES')
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const latestPhilosopherMessageId = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].role === 'philosopher') {
        return messages[index].id
      }
    }
    return undefined
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <section className="flex h-full min-h-0 w-full overflow-hidden border-[3px] border-ink bg-[#EFEFEF] shadow-brutal">
      <div className="flex h-full min-h-0 w-full flex-col gap-3 overflow-y-auto scroll-smooth p-3 md:gap-5 md:p-4">
        {messages.map((message) => (
          <MessageRow
            key={message.id}
            message={message}
            userLabel={userLabel.toUpperCase()}
            philosopherLabel={philosopherLabel.toUpperCase()}
            isLatestPhilosopher={message.id === latestPhilosopherMessageId}
            showWaveform={
              isPhilosopherSpeaking && message.id === latestPhilosopherMessageId
            }
          />
        ))}

        {isLoading && (
          <div className="px-2 pb-2 font-mono text-2xl font-bold tracking-[0.16em] text-[#6B7280] md:text-4xl md:tracking-[0.24em]">
            ...
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </section>
  )
}
