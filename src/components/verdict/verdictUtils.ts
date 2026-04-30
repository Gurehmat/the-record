import type { FactCheck, Fallacy, Message, SetupConfig } from '../../types'

export type SpeakerVerdictStats = {
  speaker: string
  claimsMade: number
  claimsVerified: number
  falseClaims: number
  fallacies: number
  score: number
}

export type DialogueHighlight = {
  id: string
  timestamp: number
  userText: string
  opponentText: string
}

export function clampScore(score: number) {
  return Math.max(0, Math.min(100, score))
}

export function calculateScore(fallacyCount: number, falseClaimCount: number) {
  return clampScore(100 - fallacyCount * 15 - falseClaimCount * 10)
}

export function formatClock(timestamp: number, includeSeconds = true) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds ? { second: '2-digit' as const } : {}),
  })
}

export function formatDate(timestamp = Date.now()) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDuration(messages: Message[]) {
  if (messages.length < 2) {
    return '0 MIN 00 SEC'
  }

  const timestamps = messages.map((message) => message.timestamp)
  const seconds = Math.max(0, Math.round((Math.max(...timestamps) - Math.min(...timestamps)) / 1000))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours} HR ${minutes} MIN ${String(remainingSeconds).padStart(2, '0')} SEC`
  }

  return `${minutes} MIN ${String(remainingSeconds).padStart(2, '0')} SEC`
}

export function getSessionNumber(messages: Message[]) {
  const seed = messages[0]?.timestamp
  if (!seed) {
    return '001'
  }

  return String((Math.abs(seed) % 999) + 1).padStart(3, '0')
}

export function normalizeSpeakerName(value: string, fallback: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed.toUpperCase() : fallback
}

export function getTopic(config: SetupConfig) {
  return config.topic.trim() || 'UNSPECIFIED PROCEEDINGS'
}

export function isFalseClaim(factCheck: FactCheck) {
  return factCheck.verdict === 'false'
}

export function isVerifiedClaim(factCheck: FactCheck) {
  return factCheck.verdict === 'true'
}

export function getFactChecksForSpeaker(
  factChecks: FactCheck[],
  speaker: string,
  fallbackSpeaker: string,
) {
  return factChecks.filter((factCheck) => {
    const assignedSpeaker = factCheck.speaker?.trim() || fallbackSpeaker
    return assignedSpeaker.toUpperCase() === speaker.toUpperCase()
  })
}

export function getFallaciesForSpeaker(fallacies: Fallacy[], speaker: string) {
  return fallacies.filter(
    (fallacy) => fallacy.speaker.trim().toUpperCase() === speaker.toUpperCase(),
  )
}

export function getSpeakerStats({
  speaker,
  fallbackSpeaker,
  factChecks,
  fallacies,
}: {
  speaker: string
  fallbackSpeaker: string
  factChecks: FactCheck[]
  fallacies: Fallacy[]
}): SpeakerVerdictStats {
  const speakerFactChecks = getFactChecksForSpeaker(factChecks, speaker, fallbackSpeaker)
  const speakerFallacies = getFallaciesForSpeaker(fallacies, speaker)
  const falseClaims = speakerFactChecks.filter(isFalseClaim).length

  return {
    speaker,
    claimsMade: speakerFactChecks.length,
    claimsVerified: speakerFactChecks.filter(isVerifiedClaim).length,
    falseClaims,
    fallacies: speakerFallacies.length,
    score: calculateScore(speakerFallacies.length, falseClaims),
  }
}

export function getFactCheckBadge(factCheck: FactCheck) {
  if (factCheck.status === 'pending') {
    return {
      label: 'CHECKING',
      colorClass: 'border-warning text-warning',
      stripeClass: 'border-warning',
    }
  }

  if (factCheck.verdict === 'true') {
    return {
      label: 'CLAIM VERIFIED',
      colorClass: 'border-verified text-verified',
      stripeClass: 'border-verified',
    }
  }

  if (factCheck.verdict === 'false') {
    return {
      label: 'CLAIM FALSE',
      colorClass: 'border-accent text-accent',
      stripeClass: 'border-accent',
    }
  }

  if (factCheck.verdict === 'misleading') {
    return {
      label: 'MISLEADING',
      colorClass: 'border-warning text-warning',
      stripeClass: 'border-warning',
    }
  }

  return {
    label: factCheck.verdict === 'rate_limited' ? 'RATE LIMITED' : 'UNVERIFIABLE',
    colorClass: 'border-ink text-ink',
    stripeClass: 'border-ink',
  }
}

export function getDialogueHighlights(messages: Message[]) {
  const highlights: DialogueHighlight[] = []

  for (let index = 0; index < messages.length - 1; index += 1) {
    const current = messages[index]
    const next = messages[index + 1]

    if (current.role === 'user' && next.role === 'philosopher') {
      highlights.push({
        id: `${current.id}-${next.id}`,
        timestamp: current.timestamp,
        userText: current.content,
        opponentText: next.content,
      })
    }
  }

  return highlights
    .toSorted(
      (left, right) =>
        right.userText.length +
        right.opponentText.length -
        (left.userText.length + left.opponentText.length),
    )
    .slice(0, 3)
}

export function countQuestions(messages: Message[]) {
  return messages.filter((message) => message.role === 'philosopher').length
}

export function countDefinitionsRequested(messages: Message[]) {
  const count = messages
    .filter((message) => message.role === 'philosopher')
    .reduce((total, message) => total + (message.content.match(/\?/g)?.length ?? 0), 0)

  return Math.max(1, Math.min(8, count || 1))
}
