import { Landmark, PenLine, Sigma } from 'lucide-react'

import { PHILOSOPHERS } from '../../lib/philosophers'
import type { Philosopher } from '../../types'

type PhilosopherSelectProps = {
  value: Philosopher | null
  onChange: (philosopher: Philosopher) => void
}

export function PhilosopherSelect({
  value,
  onChange,
}: PhilosopherSelectProps) {
  const getMeta = (philosopher: Philosopher) => {
    if (philosopher.id === 'socrates') {
      return {
        primary: 'SOCRATES - Athens, 470 BC.',
        secondary: 'Asks more than he answers. Defines terms.',
        icon: Sigma,
      }
    }

    if (philosopher.id === 'christopher-hitchens') {
      return {
        primary: 'CHRISTOPHER HITCHENS - Modern.',
        secondary: 'Sharp, witty, literary, takes no prisoners.',
        icon: PenLine,
      }
    }

    return {
      primary: 'FRIEDRICH NIETZSCHE - Röcken, 1844.',
      secondary: 'Provocative. Confrontational. Breaks your idols.',
      icon: Landmark,
    }
  }

  return (
    <section>
      <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink">
        SELECT OPPONENT
      </p>
      <div className="space-y-3">
        {PHILOSOPHERS.map((philosopher) => {
          const isSelected = value?.id === philosopher.id
          const meta = getMeta(philosopher)
          const Icon = meta.icon

          return (
            <button
              key={philosopher.id}
              type="button"
              onClick={() => onChange(philosopher)}
              className={`flex w-full items-start gap-3 border-[3px] px-4 py-3 text-left shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none ${
                isSelected
                  ? 'border-ink bg-ink text-white'
                  : 'border-ink bg-parchment text-ink'
              }`}
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border-2 ${
                  isSelected ? 'border-white' : 'border-ink'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.16em]">
                  {meta.primary}
                </p>
                <p className="mt-1 font-mono text-xs leading-5">{meta.secondary}</p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
