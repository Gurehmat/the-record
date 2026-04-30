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
    <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-[1600px] flex-col overflow-visible px-3 pt-3 md:h-[calc(100vh-72px)] md:overflow-hidden md:px-5 md:pt-4">
      <div className="flex-shrink-0">
        <MatchupHeader />
      </div>

      <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-visible py-3 md:flex-row md:overflow-hidden md:py-4">
        <div className="flex h-[60vh] min-w-0 overflow-hidden md:h-auto md:flex-1">
          <ChatArea />
        </div>

        <aside className="grid min-h-0 w-full flex-shrink-0 grid-cols-1 gap-4 overflow-visible md:flex md:w-[350px] md:flex-col md:overflow-hidden xl:w-1/3">
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
