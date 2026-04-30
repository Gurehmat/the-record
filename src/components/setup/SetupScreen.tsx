import { useDebateStore } from '../../store/useDebateStore'
import { ForumConfig } from './ForumConfig'
import { ModeSelector } from './ModeSelector'
import { RecordConfig } from './RecordConfig'

export function SetupScreen() {
  const config = useDebateStore((state) => state.config)
  const setMode = useDebateStore((state) => state.setMode)
  const setConfig = useDebateStore((state) => state.setConfig)
  const setDebateState = useDebateStore((state) => state.setDebateState)

  const recordReady =
    config.speaker1.trim() !== '' && config.speaker2.trim() !== ''
  const forumReady =
    config.speaker1.trim() !== '' && config.philosopher !== null
  const canBegin = config.mode === 'record' ? recordReady : forumReady

  const handleBeginSession = () => {
    if (!canBegin) {
      return
    }

    setDebateState('live')
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pt-10">
      <section className="mb-8">
        <h1 className="font-display text-4xl font-bold uppercase tracking-[0.14em] text-ink sm:text-5xl">
          INITIALIZE PROCEEDINGS
        </h1>
        <p className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-ink sm:text-sm">
          ESTABLISH DEBATE PARAMETERS AND SUBJECT MATTER.
        </p>
        <div className="mt-4 h-[3px] w-full bg-accent" />
      </section>

      <section className="space-y-5">
        <ModeSelector mode={config.mode} onSelectMode={setMode} />

        {config.mode === 'record' ? (
          <RecordConfig
            speaker1={config.speaker1}
            speaker2={config.speaker2}
            topic={config.topic}
            onSpeaker1Change={(speaker1) => setConfig({ speaker1 })}
            onSpeaker2Change={(speaker2) => setConfig({ speaker2 })}
            onTopicChange={(topic) => setConfig({ topic })}
          />
        ) : (
          <ForumConfig
            alias={config.speaker1}
            philosopher={config.philosopher}
            inputMode={config.inputMode}
            topic={config.topic}
            onAliasChange={(speaker1) => setConfig({ speaker1 })}
            onPhilosopherChange={(philosopher) => setConfig({ philosopher })}
            onInputModeChange={(inputMode) => setConfig({ inputMode })}
            onTopicChange={(topic) => setConfig({ topic })}
          />
        )}

        <button
          type="button"
          disabled={!canBegin}
          onClick={handleBeginSession}
          className="flex w-full items-center justify-center border-[3px] border-ink bg-ink px-6 py-4 font-mono text-sm font-bold uppercase tracking-[0.24em] text-white shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:bg-ink/60 disabled:text-white/70"
        >
          BEGIN PROCEEDINGS →
        </button>
      </section>
    </main>
  )
}
