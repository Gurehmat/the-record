import { Landmark, Smile } from 'lucide-react'

import { useDebateStore } from '../../store/useDebateStore'

export function MatchupHeader() {
  const userName = useDebateStore((state) => state.config.speaker1.trim() || 'PARTICIPANT_01')
  const philosopher = useDebateStore((state) => state.config.philosopher)

  const philosopherName = philosopher?.name.toUpperCase() ?? 'SOCRATES'
  const philosopherEra = philosopher?.era ?? '470 BC - 399 BC'

  return (
    <section className="border-[3px] border-ink bg-[#EFEFEF] shadow-brutal">
      <div className="grid grid-cols-1 items-center gap-2 px-3 py-3 text-center md:grid-cols-[1fr_auto_1fr] md:gap-4 md:px-5 md:text-left">
        <div className="flex min-w-0 flex-col items-center gap-2 md:flex-row md:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border-[3px] border-ink bg-parchment text-ink md:h-10 md:w-10">
            <Smile className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <p className="min-w-0 wrap-break-word font-display text-xl font-bold uppercase tracking-[0.04em] text-ink md:text-3xl md:tracking-[0.06em]">
            YOU: {userName.toUpperCase()}
          </p>
        </div>

        <p className="font-display text-2xl font-bold uppercase tracking-[0.12em] text-accent md:text-4xl md:tracking-[0.16em]">
          VS
        </p>

        <div className="flex min-w-0 flex-col-reverse items-center gap-2 md:flex-row md:justify-end md:gap-3">
          <p className="min-w-0 wrap-break-word font-display text-lg font-bold uppercase tracking-[0.04em] text-ink md:text-right md:text-[2rem] md:tracking-[0.06em]">
            {philosopherName} // {philosopherEra}
          </p>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border-[3px] border-ink bg-ink text-white md:h-10 md:w-10">
            <Landmark className="h-5 w-5" strokeWidth={2.4} />
          </div>
        </div>
      </div>
      <div className="h-[3px] w-full bg-accent" />
    </section>
  )
}
