import { ClipboardCheck, LoaderCircle } from 'lucide-react'

import { useDebateStore } from '../../store/useDebateStore'
import type { FactCheck } from '../../types'

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function getVerdictStyles(verdict: FactCheck['verdict']) {
  if (verdict === 'true') {
    return {
      text: 'Verified',
      cardClass: 'border-verified bg-[#DCFCE7]',
      badgeClass: 'bg-verified text-white',
    }
  }

  if (verdict === 'false') {
    return {
      text: 'False',
      cardClass: 'border-accent bg-[#FDE2E2]',
      badgeClass: 'bg-accent text-white',
    }
  }

  if (verdict === 'misleading') {
    return {
      text: 'Misleading',
      cardClass: 'border-warning bg-[#FEF3C7]',
      badgeClass: 'bg-warning text-white',
    }
  }

  return {
    text: verdict === 'rate_limited' ? 'Rate Limited' : 'Unverifiable',
    cardClass: 'border-ink bg-parchment',
    badgeClass: 'bg-ink text-white',
  }
}

export function RecordFactCheckPanel() {
  const factChecks = useDebateStore((state) => state.factChecks)

  return (
    <section className="flex min-h-[220px] flex-1 flex-col border-[3px] border-ink bg-[#EFEFEF] shadow-brutal md:min-h-0">
      <header className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-3 py-3">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-white" strokeWidth={2.8} />
          <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-white">
            Fact Check Log
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {factChecks.length === 0 ? (
          <div className="flex h-full min-h-[130px] items-center justify-center border-2 border-dashed border-ink/35 bg-parchment p-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink/55">
              Awaiting claims...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {factChecks.map((factCheck) => {
              const isPending = factCheck.status === 'pending'
              const styles = getVerdictStyles(factCheck.verdict)

              return (
                <article
                  key={factCheck.id}
                  className={`relative border-2 px-3 py-3 ${
                    isPending ? 'border-ink bg-parchment' : styles.cardClass
                  }`}
                >
                  <span
                    className={`mb-2 inline-flex items-center gap-1 px-2 py-[2px] font-mono text-[10px] font-bold uppercase tracking-[0.12em] sm:absolute sm:right-2 sm:top-2 sm:mb-0 ${
                      isPending ? 'bg-ink text-white' : styles.badgeClass
                    }`}
                  >
                    {isPending ? (
                      <LoaderCircle className="h-3 w-3 animate-spin" />
                    ) : null}
                    {isPending ? 'Checking' : styles.text}
                  </span>
                  <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink/60">
                    [{formatTimestamp(factCheck.timestamp)}]
                  </p>
                  <p className="wrap-break-word font-mono text-xs font-bold leading-relaxed text-ink sm:pr-24">
                    CLAIM: {factCheck.claim}
                  </p>
                  <p className="mt-3 wrap-break-word border-t border-ink/20 pt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-ink/70">
                    SOURCE:{' '}
                    {factCheck.sources.length > 0
                      ? factCheck.sources.join(' | ')
                      : factCheck.explanation}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <footer className="border-t-[3px] border-ink bg-parchment px-3 py-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink/60">
          Auto-checking via Gemini + Google Search
        </p>
      </footer>
    </section>
  )
}
