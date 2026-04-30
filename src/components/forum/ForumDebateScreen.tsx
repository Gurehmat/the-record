import { ChatArea } from './ChatArea'
import { FactCheckPanel } from './FactCheckPanel'
import { FallacyPanel } from './FallacyPanel'
import { InputBar } from './InputBar'
import { MatchupHeader } from './MatchupHeader'
import { FallacyModal } from '../shared/FallacyModal'
import { useDebateStore } from '../../store/useDebateStore'

export function ForumDebateScreen() {
  const activeFallacyModal = useDebateStore((state) => state.activeFallacyModal)
  const dismissFallacyModal = useDebateStore((state) => state.dismissFallacyModal)
  const addMessage = useDebateStore((state) => state.addMessage)

  const handleResume = () => {
    dismissFallacyModal()
  }

  const handleDispute = () => {
    dismissFallacyModal()
    addMessage({
      id: `system-dispute-${Date.now()}`,
      role: 'system',
      content: '⚖ FLAG DISPUTED BY PARTICIPANT — PROCEEDINGS CONTINUE',
      timestamp: Date.now(),
    })
  }

  return (
    <main className="mx-auto flex h-[calc(100vh-72px)] w-full max-w-[1600px] flex-col overflow-hidden px-5 pt-4">
      <div className="flex-shrink-0">
        <MatchupHeader />
      </div>

      <section className="flex min-h-0 flex-1 gap-4 overflow-hidden py-4">
        <div className="flex min-w-0 flex-1 overflow-hidden">
          <ChatArea />
        </div>

        <aside className="flex min-h-0 w-[350px] flex-shrink-0 flex-col gap-4 overflow-hidden xl:w-1/3">
          <FallacyPanel />
          <FactCheckPanel />
        </aside>
      </section>

      <InputBar />

      {activeFallacyModal && (
        <FallacyModal
          fallacy={activeFallacyModal}
          onResume={handleResume}
          onDispute={handleDispute}
        />
      )}
    </main>
  )
}
