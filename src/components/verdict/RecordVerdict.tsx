import { Download, PlusCircle, Share2, UserRound } from 'lucide-react'
import type { ReactNode } from 'react'

import { useDebateStore } from '../../store/useDebateStore'
import type { FactCheck, Fallacy, Message, RecordSpeakerId } from '../../types'
import type { VerdictActions } from './VerdictScreen'
import {
  calculateScore,
  formatClock,
  formatDate,
  getFactCheckBadge,
  getSessionNumber,
  getTopic,
  normalizeSpeakerName,
} from './verdictUtils'

function MetadataLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink">
      <span className="shrink-0">{label}</span>
      <span className="min-w-[54px] flex-1 overflow-hidden whitespace-nowrap text-ink/60">
        ................................
      </span>
      <span className="min-w-0 max-w-[52%] truncate text-right">{value}</span>
    </div>
  )
}

function ScoreCard({
  speaker,
  claimsMade,
  claimsVerified,
  fallacies,
  score,
  scoreTone,
}: {
  speaker: string
  claimsMade: number
  claimsVerified: number
  fallacies: number
  score: number
  scoreTone: 'green' | 'red'
}) {
  const isCredible = score >= 70

  return (
    <article className="border-[3px] border-ink bg-[#F8F6F0] shadow-brutal">
      <header className="flex items-center justify-between border-b-[3px] border-ink bg-[#E8E1DC] px-4 py-3">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-ink">
          {speaker}
        </p>
        <UserRound className="h-5 w-5" strokeWidth={2.5} />
      </header>

      <div className="flex min-h-[150px] flex-col items-center justify-center border-b-[3px] border-ink px-4 py-7">
        <p
          className={`font-display text-6xl font-bold leading-none ${
            scoreTone === 'green' ? 'text-verified' : 'text-accent'
          }`}
        >
          {score}%
        </p>
        <p className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink">
          CREDIBILITY SCORE
        </p>
      </div>

      <dl className="space-y-3 px-4 py-4 font-mono text-xs uppercase tracking-[0.12em]">
        <div className="flex justify-between gap-4">
          <dt>CLAIMS MADE</dt>
          <dd>{claimsMade}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>CLAIMS VERIFIED</dt>
          <dd>{claimsVerified}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>FALLACIES</dt>
          <dd className="font-bold text-accent">{fallacies}</dd>
        </div>
      </dl>

      <div
        className={`border-t-[3px] border-ink px-4 py-4 text-center font-mono text-sm font-bold uppercase tracking-[0.16em] text-white ${
          isCredible ? 'bg-verified' : 'bg-accent'
        }`}
      >
        VERDICT: {isCredible ? 'CREDIBLE' : 'NEEDS WORK'}
      </div>
    </article>
  )
}

function normalize(value: string) {
  return value.trim().toUpperCase()
}

function messageSpeakerName(
  message: Message,
  speakerA: string,
  speakerB: string,
) {
  if (message.speaker?.trim()) {
    return normalize(message.speaker)
  }

  if (message.speakerId === 'speaker1') {
    return normalize(speakerA)
  }

  if (message.speakerId === 'speaker2') {
    return normalize(speakerB)
  }

  if (message.role === 'user') {
    return normalize(speakerA)
  }

  if (message.role === 'philosopher') {
    return normalize(speakerB)
  }

  return ''
}

function belongsToSpeaker(
  value: string | undefined,
  speaker: string,
  speakerId: RecordSpeakerId,
) {
  const assigned = normalize(value || '')
  const generic = speakerId === 'speaker1' ? 'SPEAKER A' : 'SPEAKER B'

  return assigned === normalize(speaker) || assigned === generic
}

function getRecordSpeakerStats({
  speaker,
  speakerId,
  speakerA,
  speakerB,
  messages,
  factChecks,
  fallacies,
}: {
  speaker: string
  speakerId: RecordSpeakerId
  speakerA: string
  speakerB: string
  messages: Message[]
  factChecks: FactCheck[]
  fallacies: Fallacy[]
}) {
  const speakerMessages = messages.filter(
    (message) =>
      message.role !== 'system' &&
      messageSpeakerName(message, speakerA, speakerB) === normalize(speaker),
  )
  const speakerFactChecks = factChecks.filter((factCheck) =>
    belongsToSpeaker(factCheck.speaker, speaker, speakerId),
  )
  const speakerFallacies = fallacies.filter((fallacy) =>
    belongsToSpeaker(fallacy.speaker, speaker, speakerId),
  )
  const falseClaims = speakerFactChecks.filter(
    (factCheck) => factCheck.verdict === 'false',
  ).length

  return {
    speaker,
    claimsMade: speakerMessages.length,
    claimsVerified: speakerFactChecks.filter((factCheck) => factCheck.verdict === 'true')
      .length,
    falseClaims,
    fallacies: speakerFallacies.length,
    score: calculateScore(speakerFallacies.length, falseClaims),
  }
}

function formatRecordDuration(startTime: number, endTime: number, messages: Message[]) {
  let start = startTime
  let end = endTime

  if (start === 0 && messages.length > 0) {
    start = Math.min(...messages.map((message) => message.timestamp))
  }

  if (end === 0) {
    end = messages.length > 0
      ? Math.max(...messages.map((message) => message.timestamp))
      : Date.now()
  }

  if (start === 0 || end <= start) {
    return '0 MIN 00 SEC'
  }

  const seconds = Math.max(0, Math.round((end - start) / 1000))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours} HR ${minutes} MIN ${String(remainingSeconds).padStart(2, '0')} SEC`
  }

  return `${minutes} MIN ${String(remainingSeconds).padStart(2, '0')} SEC`
}

function FactCheckCard({ factCheck }: { factCheck: FactCheck }) {
  const badge = getFactCheckBadge(factCheck)

  return (
    <article className={`border-l-[6px] ${badge.stripeClass} border-y-[3px] border-r-[3px] border-ink bg-[#F8F6F0] p-4 shadow-brutal`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="border-2 border-ink bg-parchment px-2 py-1 font-mono text-xs font-bold">
          [{formatClock(factCheck.timestamp, false)}]
        </span>
        <span
          className={`border-2 bg-parchment px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] ${badge.colorClass}`}
        >
          {badge.label}
        </span>
      </div>
      <p className="mt-4 font-mono text-sm leading-relaxed text-ink">"{factCheck.claim}"</p>
      <div className="my-4 border-t-2 border-dashed border-ink/35" />
      <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.1em] text-ink/75">
        SOURCE: {factCheck.sources[0] || factCheck.explanation || 'SYSTEM RECORD'}
      </p>
    </article>
  )
}

function FallacyCard({ fallacy }: { fallacy: Fallacy }) {
  return (
    <article className="border-l-[6px] border-accent border-y-[3px] border-r-[3px] border-ink bg-[#F8F6F0] p-4 shadow-brutal">
      <div className="flex flex-wrap items-center gap-3">
        <span className="border-2 border-ink bg-parchment px-2 py-1 font-mono text-xs font-bold">
          [{formatClock(fallacy.timestamp, false)}]
        </span>
        <span className="border-2 border-ink bg-ink px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white">
          {fallacy.speaker}
        </span>
        <span className="border-2 border-accent bg-parchment px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
          {fallacy.type}
        </span>
      </div>
      <blockquote className="mt-4 font-mono text-sm italic leading-relaxed text-ink">
        "{fallacy.quote}"
      </blockquote>
      <div className="my-4 border-t-2 border-dashed border-ink/35" />
      <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.08em] text-ink/80">
        EXPLANATION: {fallacy.description}
      </p>
    </article>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-bold uppercase tracking-normal text-ink">
        {title}
      </h2>
      <div className="mt-5 h-[3px] bg-ink" />
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  )
}

export function RecordVerdict({ onDownloadPdf, onShareLink }: VerdictActions) {
  const config = useDebateStore((state) => state.config)
  const messages = useDebateStore((state) => state.messages)
  const factChecks = useDebateStore((state) => state.factChecks)
  const fallacies = useDebateStore((state) => state.fallacies)
  const recordingStartTime = useDebateStore((state) => state.recordingStartTime)
  const recordingEndTime = useDebateStore((state) => state.recordingEndTime)
  const reset = useDebateStore((state) => state.reset)
  const setDebateState = useDebateStore((state) => state.setDebateState)

  const speakerA = normalizeSpeakerName(config.speaker1, 'SPEAKER A')
  const speakerB = normalizeSpeakerName(config.speaker2, 'SPEAKER B')
  const speakerAStats = getRecordSpeakerStats({
    speaker: speakerA,
    speakerId: 'speaker1',
    speakerA,
    speakerB,
    messages,
    factChecks,
    fallacies,
  })
  const speakerBStats = getRecordSpeakerStats({
    speaker: speakerB,
    speakerId: 'speaker2',
    speakerA,
    speakerB,
    messages,
    factChecks,
    fallacies,
  })
  const speakerAScoreTone =
    speakerAStats.score === speakerBStats.score
      ? speakerAStats.score >= 70
        ? 'green'
        : 'red'
      : speakerAStats.score > speakerBStats.score
        ? 'green'
        : 'red'
  const speakerBScoreTone =
    speakerAStats.score === speakerBStats.score
      ? speakerBStats.score >= 70
        ? 'green'
        : 'red'
      : speakerBStats.score > speakerAStats.score
        ? 'green'
        : 'red'

  const handleNewSession = () => {
    reset()
    setDebateState('setup')
  }

  return (
    <main className="mx-auto w-full max-w-[900px] px-5 pb-16 pt-9">
      <h1 className="text-center font-display text-5xl font-bold uppercase tracking-normal text-ink sm:text-6xl">
        VERDICT
      </h1>
      <div className="mx-auto mt-7 h-[3px] w-full bg-ink" />

      <section className="mt-6 grid gap-x-10 gap-y-3 border-[3px] border-ink bg-[#F8F6F0] p-5 shadow-brutal sm:grid-cols-2">
        <MetadataLine label="CASE NO." value={getSessionNumber(messages)} />
        <MetadataLine label="DATE" value={formatDate()} />
        <MetadataLine
          label="DURATION"
          value={formatRecordDuration(recordingStartTime, recordingEndTime, messages)}
        />
        <MetadataLine label="TOPIC" value={`"${getTopic(config)}"`} />
      </section>

      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <ScoreCard {...speakerAStats} scoreTone={speakerAScoreTone} />
        <ScoreCard {...speakerBStats} scoreTone={speakerBScoreTone} />
      </section>

      <Section title="FACT CHECK SUMMARY">
        {factChecks.length > 0 ? (
          factChecks.map((factCheck) => (
            <FactCheckCard key={factCheck.id} factCheck={factCheck} />
          ))
        ) : (
          <div className="border-[3px] border-dashed border-ink/60 bg-[#F8F6F0] p-6 text-center font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink/70">
            NO FACT CHECKS RECORDED
          </div>
        )}
      </Section>

      <Section title="FALLACY SUMMARY">
        {fallacies.length > 0 ? (
          fallacies.map((fallacy) => <FallacyCard key={fallacy.id} fallacy={fallacy} />)
        ) : (
          <div className="border-[3px] border-dashed border-ink/60 bg-[#F8F6F0] p-6 text-center font-mono text-xs font-bold uppercase tracking-[0.18em] text-verified">
            NO FALLACIES DETECTED
          </div>
        )}
      </Section>

      <div className="mt-16 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={onDownloadPdf}
          className="inline-flex items-center gap-3 border-[3px] border-ink bg-ink px-5 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <Download className="h-4 w-4" strokeWidth={2.8} />
          DOWNLOAD AS PDF
        </button>
        <button
          type="button"
          onClick={onShareLink}
          className="inline-flex items-center gap-3 border-[3px] border-ink bg-parchment px-5 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <Share2 className="h-4 w-4" strokeWidth={2.8} />
          SHARE LINK
        </button>
        <button
          type="button"
          onClick={handleNewSession}
          className="inline-flex items-center gap-3 border-[3px] border-ink bg-ink px-5 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <PlusCircle className="h-4 w-4" strokeWidth={2.8} />
          NEW SESSION
        </button>
      </div>

      <footer className="mt-20 border-t-[3px] border-ink pt-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
        ON THE RECORD - GENERATED BY GEMINI + ELEVENLABS - CONHACKS 2026
      </footer>
    </main>
  )
}
