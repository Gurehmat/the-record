type RecordConfigProps = {
  speaker1: string
  speaker2: string
  topic: string
  onSpeaker1Change: (value: string) => void
  onSpeaker2Change: (value: string) => void
  onTopicChange: (value: string) => void
}

export function RecordConfig({
  speaker1,
  speaker2,
  topic,
  onSpeaker1Change,
  onSpeaker2Change,
  onTopicChange,
}: RecordConfigProps) {
  return (
    <fieldset className="border-[3px] border-ink px-5 pb-5 pt-3">
      <legend className="px-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-ink">
        RECORD MODE PARAMETERS
      </legend>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="block font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink">
            SPEAKER A
          </span>
          <input
            type="text"
            value={speaker1}
            onChange={(event) => onSpeaker1Change(event.target.value)}
            placeholder="ENTER NAME..."
            className="w-full border-2 border-ink bg-parchment px-3 py-3 font-mono text-sm uppercase tracking-[0.08em] text-ink outline-none placeholder:text-ink/55 focus:border-accent"
          />
        </label>

        <label className="space-y-2">
          <span className="block font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink">
            SPEAKER B
          </span>
          <input
            type="text"
            value={speaker2}
            onChange={(event) => onSpeaker2Change(event.target.value)}
            placeholder="ENTER NAME..."
            className="w-full border-2 border-ink bg-parchment px-3 py-3 font-mono text-sm uppercase tracking-[0.08em] text-ink outline-none placeholder:text-ink/55 focus:border-accent"
          />
        </label>
      </div>

      <div className="my-5 h-[3px] bg-accent" />

      <label className="space-y-2">
        <span className="block font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink">
          DEBATE TOPIC
        </span>
        <textarea
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
          rows={4}
          placeholder="ENTER PRIMARY THESIS OR RESOLUTION..."
          className="w-full resize-none border-2 border-ink bg-parchment px-3 py-3 font-mono text-sm uppercase tracking-[0.06em] text-ink outline-none placeholder:text-ink/55 focus:border-accent"
        />
      </label>
    </fieldset>
  )
}
