import { AlertTriangle, Check } from 'lucide-react'

import { useDebateStore } from '../../store/useDebateStore'

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function RecordFallacyPanel() {
  const fallacies = useDebateStore((state) => state.fallacies)

  return (
    <section className="flex min-h-[220px] flex-1 flex-col border-[3px] border-ink bg-[#EFEFEF] shadow-brutal md:min-h-0">
      <header className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-3 py-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-white" strokeWidth={2.8} />
          <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-white">
            Fallacy Log
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {fallacies.length === 0 ? (
          <div className="flex h-full min-h-[130px] items-center justify-center border-2 border-dashed border-ink/35 bg-parchment p-4">
            <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-verified">
              <Check className="h-4 w-4" strokeWidth={2.8} />
              No fallacies detected
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {fallacies.map((fallacy, index) => (
              <article
                key={fallacy.id}
                className="relative border-2 border-accent bg-[#FDE2E2] px-3 py-3"
              >
                <span className="mb-2 inline-flex bg-accent px-2 py-[2px] font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white sm:absolute sm:right-2 sm:top-2 sm:mb-0">
                  {index % 2 === 0 ? 'Detected' : 'Flagged'}
                </span>
                <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink/60">
                  [{formatTimestamp(fallacy.timestamp)}]
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:pr-20">
                  <span className="bg-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                    {fallacy.speaker || 'Unknown'}
                  </span>
                  <span className="border-2 border-accent bg-parchment px-2 py-[3px] font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                    {fallacy.type}
                  </span>
                </div>
                <p className="mt-3 wrap-break-word font-mono text-xs leading-relaxed text-ink">
                  {fallacy.description}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
