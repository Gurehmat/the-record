import { Mic, SearchCheck } from 'lucide-react'

import type { DebateMode } from '../../types'

type ModeSelectorProps = {
  mode: DebateMode
  onSelectMode: (mode: DebateMode) => void
}

export function ModeSelector({ mode, onSelectMode }: ModeSelectorProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <button
        type="button"
        onClick={() => onSelectMode('record')}
        className={`min-h-11 border-[3px] p-4 text-left shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none sm:p-5 ${
          mode === 'record'
            ? 'border-ink bg-accent text-white'
            : 'border-ink bg-parchment text-ink'
        }`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <p className="wrap-break-word font-display text-xl font-bold uppercase tracking-[0.08em] sm:text-2xl sm:tracking-[0.12em]">
            RECORD MODE
          </p>
          <Mic className="h-6 w-6 shrink-0" strokeWidth={2.5} />
        </div>
        <div
          className={`mb-3 h-[3px] w-full ${
            mode === 'record' ? 'bg-white/85' : 'bg-accent'
          }`}
        />
        <p className="mb-3 wrap-break-word font-mono text-[11px] font-bold uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.2em]">
          TWO HUMANS // LIVE DEBATE
        </p>
        <p className="font-mono text-[13px] leading-5">
          Capture and adjudicate real-time verbal arguments between two speakers
          with automated transcript and fallacy monitoring.
        </p>
      </button>

      <button
        type="button"
        onClick={() => onSelectMode('forum')}
        className={`min-h-11 border-[3px] p-4 text-left shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none sm:p-5 ${
          mode === 'forum'
            ? 'border-ink bg-accent text-white'
            : 'border-ink bg-parchment text-ink'
        }`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <p className="wrap-break-word font-display text-xl font-bold uppercase tracking-[0.08em] sm:text-2xl sm:tracking-[0.12em]">
            FORUM MODE
          </p>
          <SearchCheck className="h-6 w-6 shrink-0" strokeWidth={2.5} />
        </div>
        <div
          className={`mb-3 h-[3px] w-full ${
            mode === 'forum' ? 'bg-white/85' : 'bg-accent'
          }`}
        />
        <p className="mb-3 wrap-break-word font-mono text-[11px] font-bold uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.2em]">
          1V1 // VS A PHILOSOPHER
        </p>
        <p className="font-mono text-[13px] leading-5">
          Enter a directed public forum against a historical thinker with guided
          rebuttal flow and real-time verification support.
        </p>
      </button>
    </section>
  )
}
