import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

import { playFallacyPing } from '../../lib/audio'
import type { Fallacy } from '../../types'
import { Button } from './Button'

type FallacyModalProps = {
  fallacy: Fallacy
  onResume: () => void
  onDispute: () => void
}

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function FallacyModal({ fallacy, onResume, onDispute }: FallacyModalProps) {
  useEffect(() => {
    void playFallacyPing()
  }, [fallacy.id])

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="w-full max-w-3xl">
        <p className="mb-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-accent">
          ↑ AUDIO PING 🔊
        </p>

        <section className="relative border-[3px] border-ink bg-parchment shadow-brutal-lg">
          <span className="absolute inset-y-0 right-0 w-1 bg-accent" aria-hidden />

          <header className="flex items-center justify-between gap-3 border-b-[3px] border-ink bg-ink px-4 py-3">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-white">
              [{formatTimestamp(fallacy.timestamp)}] FALLACY DETECTED
            </p>
            <AlertTriangle className="h-5 w-5 text-white" strokeWidth={2.4} />
          </header>

          <div className="space-y-4 px-5 py-5">
            <h2 className="font-display text-4xl font-bold uppercase tracking-[0.08em] text-accent">
              {fallacy.type}
            </h2>

            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink">
              FLAGGED FROM {fallacy.speaker}
            </p>

            <div className="h-1 w-full bg-accent" />

            <blockquote className="border-l-4 border-accent pl-4 font-serif text-lg italic leading-relaxed text-ink">
              "{fallacy.quote}"
            </blockquote>

            <div className="border-2 border-ink/25 bg-parchment px-4 py-3">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] leading-relaxed text-ink">
                {fallacy.description}
              </p>
            </div>

            <div className="h-1 w-full bg-accent" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button variant="primary" size="md" onClick={onResume} className="w-full">
                RESUME PROCEEDINGS →
              </Button>
              <Button variant="secondary" size="md" onClick={onDispute} className="w-full">
                DISPUTE FLAG
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
