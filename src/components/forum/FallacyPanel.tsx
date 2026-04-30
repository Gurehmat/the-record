import { Check, Clock3 } from 'lucide-react'

import { useDebateStore } from '../../store/useDebateStore'

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function FallacyPanel() {
  const fallacies = useDebateStore((state) => state.fallacies)

  return (
    <section className="flex min-h-[220px] flex-1 flex-col border-[3px] border-ink bg-[#EFEFEF] shadow-brutal md:min-h-0">
      <header className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-3 py-2">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.14em] text-white">
          FALLACY LOG
        </p>
        <Clock3 className="h-4 w-4 text-white" strokeWidth={2.4} />
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
        {fallacies.length === 0 ? (
          <div className="flex flex-1 items-center justify-center border-2 border-dashed border-ink/40 bg-parchment p-4">
            <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-verified">
              <Check className="h-4 w-4" strokeWidth={2.8} />
              NO FALLACIES DETECTED
            </p>
          </div>
        ) : (
          fallacies.map((fallacy) => (
            <article
              key={fallacy.id}
              className="relative border-2 border-ink bg-[#FEE2E2] px-3 py-3"
            >
              <span className="mb-2 inline-flex border-2 border-ink bg-parchment px-2 py-[2px] font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink sm:absolute sm:right-2 sm:top-2 sm:mb-0">
                FLAGGED
              </span>
              <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink/70">
                [{formatTimestamp(fallacy.timestamp)}]
              </p>
              <p className="wrap-break-word font-mono text-xs font-bold uppercase tracking-[0.1em] text-accent sm:pr-20 sm:tracking-[0.14em]">
                {fallacy.type}
              </p>
              <blockquote className="mt-2 wrap-break-word border-l-[3px] border-accent pl-2 font-mono text-xs text-ink">
                "{fallacy.quote}"
              </blockquote>
              <p className="mt-2 wrap-break-word font-mono text-xs leading-relaxed text-ink">
                {fallacy.description}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
