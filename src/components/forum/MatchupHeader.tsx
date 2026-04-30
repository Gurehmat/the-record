import { Landmark, Smile } from 'lucide-react'

import { useDebateStore } from '../../store/useDebateStore'

export function MatchupHeader() {
  const userName = useDebateStore((state) => state.config.speaker1.trim() || 'PARTICIPANT_01')
  const philosopher = useDebateStore((state) => state.config.philosopher)

  const philosopherName = philosopher?.name.toUpperCase() ?? 'SOCRATES'
  const philosopherEra = philosopher?.era ?? '470 BC - 399 BC'

  return (
    <section className="border-[3px] border-ink bg-[#EFEFEF] shadow-brutal">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-[3px] border-ink bg-parchment text-ink">
            <Smile className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <p className="font-display text-3xl font-bold uppercase tracking-[0.06em] text-ink">
            YOU: {userName.toUpperCase()}
          </p>
        </div>

        <p className="font-display text-4xl font-bold uppercase tracking-[0.16em] text-accent">
          VS
        </p>

        <div className="flex items-center justify-end gap-3">
          <p className="text-right font-display text-[2rem] font-bold uppercase tracking-[0.06em] text-ink">
            {philosopherName} // {philosopherEra}
          </p>
          <div className="flex h-10 w-10 items-center justify-center border-[3px] border-ink bg-ink text-white">
            <Landmark className="h-5 w-5" strokeWidth={2.4} />
          </div>
        </div>
      </div>
      <div className="h-[3px] w-full bg-accent" />
    </section>
  )
}
