import { Cog, LoaderCircle } from 'lucide-react'

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

export function FactCheckPanel() {
  const factChecks = useDebateStore((state) => state.factChecks)

  const getVerdictStyles = (verdict: FactCheck['verdict']) => {
    if (verdict === 'true') {
      return {
        badgeText: 'VERIFIED',
        cardClass: 'border-verified bg-[#DCFCE7]',
        badgeClass: 'border-verified text-verified',
        titleClass: 'text-verified',
      }
    }

    if (verdict === 'false') {
      return {
        badgeText: 'FALSE',
        cardClass: 'border-accent bg-[#FDE2E2]',
        badgeClass: 'border-accent text-accent',
        titleClass: 'text-accent',
      }
    }

    if (verdict === 'misleading') {
      return {
        badgeText: 'MISLEADING',
        cardClass: 'border-amber-700 bg-[#FEF3C7]',
        badgeClass: 'border-amber-700 text-amber-700',
        titleClass: 'text-amber-700',
      }
    }

    if (verdict === 'rate_limited') {
      return {
        badgeText: 'RATE LIMITED',
        cardClass: 'border-warning bg-[#FEF3C7]',
        badgeClass: 'border-warning text-warning',
        titleClass: 'text-warning',
      }
    }

    return {
      badgeText: 'UNVERIFIABLE',
      cardClass: 'border-ink bg-parchment',
      badgeClass: 'border-ink text-ink',
      titleClass: 'text-ink',
    }
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col border-[3px] border-ink bg-[#EFEFEF] shadow-brutal">
      <header className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-3 py-2">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.14em] text-white">
          FACT CHECK LOG
        </p>
        <Cog className="h-4 w-4 text-white" strokeWidth={2.4} />
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
        {factChecks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center border-2 border-dashed border-ink/40 bg-parchment p-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink/70">
              AWAITING CLAIMS...
            </p>
          </div>
        ) : (
          factChecks.map((factCheck) => {
            const isPending = factCheck.status === 'pending'
            const styles = getVerdictStyles(factCheck.verdict)

            return (
              <article
                key={factCheck.id}
                className={`relative border-2 px-3 py-3 ${isPending ? 'border-ink bg-parchment' : styles.cardClass}`}
              >
                {isPending ? (
                  <span className="absolute right-2 top-2 flex items-center gap-1 border-2 border-ink bg-parchment px-2 py-[2px] font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
                    <LoaderCircle className="h-3 w-3 animate-spin" />
                    CHECKING
                  </span>
                ) : (
                  <span
                    className={`absolute right-2 top-2 border-2 bg-parchment px-2 py-[2px] font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${styles.badgeClass}`}
                  >
                    {styles.badgeText}
                  </span>
                )}
                <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink/70">
                  [{formatTimestamp(factCheck.timestamp)}]
                </p>
                <p className={`pr-24 font-mono text-xs font-bold tracking-[0.08em] ${isPending ? 'text-ink' : styles.titleClass}`}>
                  {factCheck.claim}
                </p>
                <p className="mt-2 font-mono text-xs leading-relaxed text-ink">
                  {factCheck.explanation}
                </p>
                {factCheck.sources.length > 0 ? (
                  <p className="mt-2 border-t border-ink/20 pt-2 font-mono text-[10px] uppercase tracking-widest text-ink/80">
                    SOURCE: {factCheck.sources.join(' | ')}
                  </p>
                ) : null}
              </article>
            )
          })
        )}
      </div>
      <footer className="border-t-[3px] border-ink bg-parchment px-3 py-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink/80">
          AUTO-CHECKING VIA GEMINI + GOOGLE SEARCH
        </p>
      </footer>
    </section>
  )
}
