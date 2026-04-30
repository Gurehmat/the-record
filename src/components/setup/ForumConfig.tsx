import type { InputMode, Philosopher } from '../../types'
import { InputMethodToggle } from './InputMethodToggle'
import { PhilosopherSelect } from './PhilosopherSelect'

type ForumConfigProps = {
  alias: string
  philosopher: Philosopher | null
  inputMode: InputMode
  topic: string
  onAliasChange: (value: string) => void
  onPhilosopherChange: (value: Philosopher) => void
  onInputModeChange: (value: InputMode) => void
  onTopicChange: (value: string) => void
}

export function ForumConfig({
  alias,
  philosopher,
  inputMode,
  topic,
  onAliasChange,
  onPhilosopherChange,
  onInputModeChange,
  onTopicChange,
}: ForumConfigProps) {
  return (
    <fieldset className="border-[3px] border-ink px-3 pb-5 pt-3 sm:px-5">
      <legend className="px-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink sm:text-xs sm:tracking-[0.22em]">
        FORUM MODE CONFIGURATION
      </legend>

      <div className="mb-5 h-[3px] bg-accent" />

      <label className="space-y-2">
        <span className="block font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink sm:tracking-[0.2em]">
          YOUR ALIAS
        </span>
        <input
          type="text"
          value={alias}
          onChange={(event) => onAliasChange(event.target.value)}
          placeholder="CITIZEN_X"
          className="min-h-11 w-full border-2 border-ink bg-[#E5DFD2] px-3 py-3 font-mono text-sm uppercase tracking-[0.08em] text-ink outline-none placeholder:text-ink/55 focus:border-accent"
        />
      </label>

      <div className="mt-6">
        <PhilosopherSelect value={philosopher} onChange={onPhilosopherChange} />
      </div>

      <div className="mt-6 space-y-2">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink sm:tracking-[0.2em]">
          INPUT METHOD
        </p>
        <InputMethodToggle value={inputMode} onChange={onInputModeChange} />
      </div>

      <label className="mt-6 block space-y-2">
        <span className="block font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink sm:tracking-[0.2em]">
          DEBATE TOPIC (OPTIONAL PREMISE)
        </span>
        <textarea
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
          rows={4}
          placeholder="E.g., The concept of objective truth is obsolete in the digital age."
          className="w-full resize-none border-2 border-ink bg-parchment px-3 py-3 font-mono text-sm text-ink outline-none placeholder:text-ink/60 focus:border-accent"
        />
      </label>
    </fieldset>
  )
}
