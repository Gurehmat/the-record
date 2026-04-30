import { Keyboard, Mic } from 'lucide-react'

import type { InputMode } from '../../types'

type InputMethodToggleProps = {
  value: InputMode
  onChange: (value: InputMode) => void
}

export function InputMethodToggle({ value, onChange }: InputMethodToggleProps) {
  return (
    <div className="border-[3px] border-ink">
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => onChange('voice')}
          className={`flex min-h-11 items-center justify-center gap-1 border-r-[3px] border-ink px-2 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.08em] sm:gap-2 sm:px-4 sm:text-xs sm:tracking-[0.2em] ${
            value === 'voice' ? 'bg-ink text-white' : 'bg-parchment text-ink'
          }`}
        >
          <Mic className="h-4 w-4" strokeWidth={2.5} />
          VOICE INPUT
        </button>
        <button
          type="button"
          onClick={() => onChange('text')}
          className={`flex min-h-11 items-center justify-center gap-1 px-2 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.08em] sm:gap-2 sm:px-4 sm:text-xs sm:tracking-[0.2em] ${
            value === 'text' ? 'bg-ink text-white' : 'bg-parchment text-ink'
          }`}
        >
          <Keyboard className="h-4 w-4" strokeWidth={2.5} />
          TEXT INPUT
        </button>
      </div>
    </div>
  )
}
