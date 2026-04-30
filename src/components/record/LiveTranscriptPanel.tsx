import { useEffect, useRef } from 'react'
import { List } from 'lucide-react'

import type { RecordTranscriptMessage } from './recordTypes'

type LiveTranscriptPanelProps = {
  messages: RecordTranscriptMessage[]
}

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function LiveTranscriptPanel({ messages }: LiveTranscriptPanelProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const latestMessageId = messages.at(-1)?.id

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <section className="flex min-h-[240px] flex-1 flex-col border-[3px] border-ink bg-parchment shadow-brutal lg:min-h-0">
      <header className="flex items-center justify-between border-b-[3px] border-ink bg-[#E6E1D8] px-3 py-3">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-ink" strokeWidth={2.8} />
          <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-ink">
            Live Transcript
          </p>
        </div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink/55">
          Auto-scroll on
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[130px] items-center justify-center border-2 border-dashed border-ink/35 bg-[#EFEFEF] p-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink/55">
              Awaiting live transcript...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`border-l-[4px] px-3 py-2 font-mono text-sm leading-relaxed text-ink ${
                  message.isFlagged
                    ? 'border-warning bg-[#FFFBEB]'
                    : message.speakerId === 'speaker1'
                      ? 'border-accent bg-transparent'
                      : 'border-ink bg-[#F8F6F0]'
                } ${message.id === latestMessageId ? 'font-semibold shadow-[inset_3px_0_0_0_#1A1A1A]' : ''}`}
              >
                <span className="font-bold text-ink/45">
                  [{formatTimestamp(message.timestamp)}]
                </span>{' '}
                <span
                  className={`mr-2 inline-flex border border-ink px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.12em] ${
                    message.speakerId === 'speaker1'
                      ? 'bg-ink text-white'
                      : 'bg-parchment text-ink'
                  }`}
                >
                  {message.speakerName}
                </span>
                {message.content}
              </article>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </section>
  )
}
