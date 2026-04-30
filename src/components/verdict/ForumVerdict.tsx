import { Download, Landmark, PlusCircle, Share2, UserRound } from 'lucide-react'

import { useDebateStore } from '../../store/useDebateStore'
import type { FactCheck, Fallacy, Philosopher } from '../../types'
import type { VerdictActions } from './VerdictScreen'
import {
  countDefinitionsRequested,
  countQuestions,
  formatClock,
  formatDate,
  formatDuration,
  getDialogueHighlights,
  getFactCheckBadge,
  getSessionNumber,
  getSpeakerStats,
  getTopic,
  normalizeSpeakerName,
} from './verdictUtils'

const PHILOSOPHER_QUOTES: Record<string, string> = {
  socrates: 'The unexamined life is not worth living.',
  'christopher-hitchens':
    'What can be asserted without evidence can also be dismissed without evidence.',
  nietzsche: 'He who has a why to live can bear almost any how.',
}

function getPhilosopherQuote(philosopher: Philosopher | null) {
  if (!philosopher) {
    return PHILOSOPHER_QUOTES.socrates
  }

  return PHILOSOPHER_QUOTES[philosopher.id] || PHILOSOPHER_QUOTES.socrates
}

function ParticipantCard({
  speaker,
  claimsMade,
  fallacies,
  score,
}: {
  speaker: string
  claimsMade: number
  fallacies: number
  score: number
}) {
  const isCredible = score >= 70

  return (
    <article className="border-[3px] border-ink bg-[#F8F6F0] p-4 shadow-brutal">
      <header className="flex items-center justify-between gap-3 border-b-2 border-ink pb-3">
        <p className="min-w-0 wrap-break-word font-mono text-xs font-bold uppercase tracking-[0.08em] text-ink sm:tracking-[0.14em]">
          {speaker}
        </p>
        <UserRound className="h-4 w-4" strokeWidth={2.5} />
      </header>

      <div className="border-b-2 border-ink py-7 text-center">
        <p className={`font-display text-6xl font-bold ${isCredible ? 'text-ink' : 'text-accent'}`}>
          {score}%
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/50 sm:tracking-[0.18em]">
          CREDIBILITY SCORE
        </p>
      </div>

      <div className="grid grid-cols-2 border-b-2 border-ink py-4 font-mono text-[10px] uppercase tracking-[0.08em] sm:tracking-[0.12em]">
        <div className="border-r-2 border-ink pr-3">
          <p>CLAIMS MADE</p>
          <p className="mt-2 text-xl font-bold">{claimsMade}</p>
        </div>
        <div className="bg-[#F9D0D0] pl-3">
          <p>FALLACIES</p>
          <p className="mt-2 text-xl font-bold text-accent">{fallacies}</p>
        </div>
      </div>

      <div
        className={`mx-auto mt-4 w-fit max-w-full wrap-break-word border-2 border-ink px-3 py-2 text-center font-mono text-xs font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em] ${
          isCredible ? 'bg-[#E3F2D8] text-verified' : 'bg-[#F9D0D0] text-accent'
        }`}
      >
        VERDICT: {isCredible ? 'CREDIBLE' : 'NEEDS WORK'}
      </div>
    </article>
  )
}

function OpponentCard({
  philosopher,
  questions,
  definitions,
}: {
  philosopher: Philosopher | null
  questions: number
  definitions: number
}) {
  const philosopherName = philosopher?.name.toUpperCase() || 'SOCRATES'

  return (
    <article className="border-[3px] border-ink bg-ink p-4 text-white shadow-brutal">
      <header className="flex items-center justify-between gap-3 border-b-2 border-white pb-3">
        <p className="min-w-0 wrap-break-word font-mono text-xs font-bold uppercase tracking-[0.08em] sm:tracking-[0.14em]">
          OPPONENT: {philosopherName}
        </p>
        <Landmark className="h-4 w-4" strokeWidth={2.5} />
      </header>

      <div className="grid gap-5 py-5 sm:grid-cols-[54px_1fr]">
        <p className="font-display text-5xl font-bold leading-none">99</p>
        <blockquote className="border-l-2 border-white pl-4 font-mono text-xs italic leading-relaxed text-white/85">
          "{getPhilosopherQuote(philosopher)}"
          <br />
          <span className="not-italic text-white/55">- {philosopherName}</span>
        </blockquote>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t-2 border-white pt-4 font-mono text-[10px] uppercase tracking-[0.08em] sm:tracking-[0.12em]">
        <div className="border-2 border-white/70 p-3">
          <p>QUESTIONS POSED</p>
          <p className="mt-2 text-xl font-bold">{questions}</p>
        </div>
        <div className="border-2 border-white/70 p-3">
          <p>DEFINITIONS REQUESTED</p>
          <p className="mt-2 text-xl font-bold">{definitions}</p>
        </div>
      </div>
    </article>
  )
}

function CompactFactCheckCard({ factCheck }: { factCheck: FactCheck }) {
  const badge = getFactCheckBadge(factCheck)

  return (
    <article className="border-[3px] border-ink bg-[#F8F6F0] p-4 shadow-brutal">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">
          CLAIM #{factCheck.id.slice(-2).toUpperCase()}
        </p>
        <span
          className={`border-2 bg-parchment px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em] ${badge.colorClass}`}
        >
          {badge.label.replace('CLAIM ', '')}
        </span>
      </div>
      <p className="mt-4 wrap-break-word font-mono text-xs leading-relaxed text-ink">"{factCheck.claim}"</p>
      <p className="mt-4 wrap-break-word border-t-2 border-ink/20 bg-[#F3E2E2] p-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.08em] text-ink/80">
        SYSTEM NOTE: {factCheck.explanation || factCheck.sources[0] || 'RECORDED'}
      </p>
    </article>
  )
}

function CompactFallacyCard({ fallacy }: { fallacy: Fallacy }) {
  return (
    <article className="border-[3px] border-ink bg-[#F8F6F0] p-4 shadow-brutal">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="border-2 border-ink bg-ink px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white">
          {fallacy.type}
        </span>
        <span className="font-mono text-[10px] text-ink/60">[{formatClock(fallacy.timestamp, false)}]</span>
      </div>
      <blockquote className="mt-4 wrap-break-word border-l-4 border-accent pl-3 font-mono text-xs leading-relaxed">
        "{fallacy.quote}"
      </blockquote>
      <p className="mt-4 wrap-break-word font-mono text-[10px] uppercase leading-relaxed tracking-[0.08em] text-ink/75">
        ANALYSIS: {fallacy.description}
      </p>
    </article>
  )
}

export function ForumVerdict({ onDownloadPdf, onShareLink, shareLabel }: VerdictActions) {
  const config = useDebateStore((state) => state.config)
  const messages = useDebateStore((state) => state.messages)
  const factChecks = useDebateStore((state) => state.factChecks)
  const fallacies = useDebateStore((state) => state.fallacies)
  const reset = useDebateStore((state) => state.reset)
  const setDebateState = useDebateStore((state) => state.setDebateState)

  const participant = normalizeSpeakerName(config.speaker1, 'PARTICIPANT_01')
  const stats = getSpeakerStats({
    speaker: participant,
    fallbackSpeaker: participant,
    factChecks,
    fallacies,
  })
  const sessionNumber = getSessionNumber(messages)
  const philosopherName = config.philosopher?.name.toUpperCase() || 'SOCRATES'
  const highlights = getDialogueHighlights(messages)

  const handleNewSession = () => {
    reset()
    setDebateState('setup')
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-56px)] w-full max-w-[1100px] px-4 pb-12 pt-7 sm:px-5 sm:pt-8 md:px-8">
      <h1 className="wrap-break-word font-display text-2xl font-bold uppercase tracking-normal text-ink sm:text-5xl">
        VERDICT <span className="text-ink/30">//</span> FORUM SESSION {sessionNumber}
      </h1>

      <div className="mt-6 grid gap-4 wrap-break-word border-y-[3px] border-ink py-4 font-mono text-[10px] uppercase tracking-[0.08em] sm:grid-cols-5 sm:tracking-[0.12em]">
        <div>
          <p className="text-ink/45">ID</p>
          <p className="font-bold">SESSION {sessionNumber}</p>
        </div>
        <div>
          <p className="text-ink/45">DATE</p>
          <p className="font-bold">{formatDate()}</p>
        </div>
        <div>
          <p className="text-ink/45">DURATION</p>
          <p className="font-bold">{formatDuration(messages)}</p>
        </div>
        <div>
          <p className="text-ink/45">OPPONENT</p>
          <p className="font-bold">{philosopherName}</p>
        </div>
        <div>
          <p className="text-ink/45">TOPIC</p>
          <p className="font-bold">{getTopic(config)}</p>
        </div>
      </div>

      <section className="mt-7 grid gap-5 md:grid-cols-2">
        <ParticipantCard {...stats} />
        <OpponentCard
          philosopher={config.philosopher}
          questions={countQuestions(messages)}
          definitions={countDefinitionsRequested(messages)}
        />
      </section>

      <section className="mt-10">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <h2 className="min-w-0 wrap-break-word bg-ink px-3 py-2 font-display text-base font-bold uppercase tracking-normal text-white sm:text-lg">
            DIALOGUE HIGHLIGHTS
          </h2>
          <div className="h-[2px] flex-1 bg-ink" />
        </div>
        <div className="mt-5 space-y-4">
          {highlights.length > 0 ? (
            highlights.map((highlight) => (
              <article
                key={highlight.id}
                className="border-[3px] border-ink bg-[#F8F6F0] p-4 shadow-brutal"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">
                  [{formatClock(highlight.timestamp, false)}]
                </p>
                <div className="mt-3 space-y-3 font-mono text-xs leading-relaxed">
                  <p className="wrap-break-word">
                    <span className="mr-2 inline-flex max-w-full wrap-break-word border-2 border-ink bg-parchment px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em]">
                      {philosopherName}
                    </span>
                    {highlight.opponentText}
                  </p>
                  <p className="wrap-break-word">
                    <span className="mr-2 inline-flex max-w-full wrap-break-word border-2 border-ink bg-ink px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-white sm:tracking-[0.12em]">
                      {participant}
                    </span>
                    {highlight.userText}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="border-[3px] border-dashed border-ink/60 p-6 text-center font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink/65">
              NO DIALOGUE HIGHLIGHTS RECORDED
            </div>
          )}
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="border-b-[3px] border-ink pb-2 font-display text-xl font-bold uppercase tracking-normal">
            FACT CHECK SUMMARY
          </h2>
          <div className="mt-5 space-y-4">
            {factChecks.length > 0 ? (
              factChecks.map((factCheck) => (
                <CompactFactCheckCard key={factCheck.id} factCheck={factCheck} />
              ))
            ) : (
              <div className="border-[3px] border-dashed border-ink/60 p-6 text-center font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink/65">
                NO FACT CHECKS RECORDED
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="border-b-[3px] border-ink pb-2 font-display text-xl font-bold uppercase tracking-normal">
            FALLACY SUMMARY
          </h2>
          <div className="mt-5 space-y-4">
            {fallacies.length > 0 ? (
              fallacies.map((fallacy) => (
                <CompactFallacyCard key={fallacy.id} fallacy={fallacy} />
              ))
            ) : (
              <div className="border-[3px] border-dashed border-ink/60 p-8 text-center font-mono text-xs font-bold uppercase leading-relaxed tracking-[0.16em] text-verified">
                NO FURTHER FALLACIES DETECTED
                <br />
                LOGIC STREAM VALIDATED
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-col justify-center gap-3 border-t-[3px] border-ink pt-7 sm:flex-row sm:flex-wrap sm:gap-4">
        <button
          type="button"
          onClick={onDownloadPdf}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 border-[3px] border-ink bg-ink px-4 py-3 text-center font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none sm:w-auto sm:px-5 sm:tracking-[0.14em]"
        >
          <Download className="h-4 w-4" strokeWidth={2.8} />
          DOWNLOAD AS PDF
        </button>
        <button
          type="button"
          onClick={onShareLink}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 border-[3px] border-ink bg-parchment px-4 py-3 text-center font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none sm:w-auto sm:px-5 sm:tracking-[0.14em]"
        >
          <Share2 className="h-4 w-4" strokeWidth={2.8} />
          {shareLabel}
        </button>
        <button
          type="button"
          onClick={handleNewSession}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 border-[3px] border-ink bg-ink px-4 py-3 text-center font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none sm:w-auto sm:px-5 sm:tracking-[0.14em]"
        >
          <PlusCircle className="h-4 w-4" strokeWidth={2.8} />
          NEW SESSION
        </button>
      </div>

      <footer className="mt-9 wrap-break-word text-center font-mono text-[10px] uppercase tracking-[0.12em] text-ink/45 sm:tracking-[0.2em]">
        ON THE RECORD - GENERATED BY GEMINI + ELEVENLABS - CONHACKS 2026
      </footer>
    </main>
  )
}
