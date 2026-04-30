import clsx from 'clsx'
import type { ReactNode } from 'react'

import type { DebateMode } from '../../types'

type ModeToggleProps = {
  mode: DebateMode
  onToggle: (mode: DebateMode) => void
}

const modes: Array<{
  value: DebateMode
  label: string
  icon: ReactNode
}> = [
  {
    value: 'record',
    label: 'RECORD',
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <rect x="9" y="3" width="6" height="11" />
        <path d="M5 11v1a7 7 0 0 0 14 0v-1" />
        <path d="M12 19v3" />
        <path d="M8 22h8" />
      </svg>
    ),
  },
  {
    value: 'forum',
    label: 'FORUM',
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4z" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
        <path d="M9 16h3" />
      </svg>
    ),
  },
]

export function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  return (
    <div className="inline-flex border-[3px] border-ink bg-parchment shadow-brutal">
      {modes.map((item, index) => {
        const isActive = item.value === mode

        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggle(item.value)}
            className={clsx(
              'inline-flex min-w-32 items-center justify-center gap-2 border-ink px-5 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-colors duration-100',
              index > 0 && 'border-l-[3px]',
              isActive ? 'bg-accent text-white' : 'bg-parchment text-ink hover:bg-ink hover:text-parchment',
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
