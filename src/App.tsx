import { ForumDebateScreen } from './components/forum/ForumDebateScreen'
import { RecordDebateScreen } from './components/record/RecordDebateScreen'
import { SetupScreen } from './components/setup/SetupScreen'
import { Navbar } from './components/shared/Navbar'
import { VerdictScreen } from './components/verdict/VerdictScreen'
import { useDebateStore } from './store/useDebateStore'

function App() {
  const mode = useDebateStore((state) => state.config.mode)
  const debateState = useDebateStore((state) => state.debateState)

  return (
    <div className="min-h-screen bg-parchment text-ink">
      <Navbar mode={mode} debateState={debateState} />

      {debateState === 'setup' ? (
        <SetupScreen />
      ) : debateState === 'verdict' ? (
        <VerdictScreen />
      ) : debateState === 'live' && mode === 'record' ? (
        <RecordDebateScreen />
      ) : debateState === 'live' && mode === 'forum' ? (
        <ForumDebateScreen />
      ) : (
        <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl items-center justify-center px-5">
          <p className="border-[3px] border-ink bg-parchment p-6 font-mono text-xl font-bold uppercase tracking-wider shadow-brutal">
            Debate coming soon...
          </p>
        </main>
      )}
    </div>
  )
}

export default App
