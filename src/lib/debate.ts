import { generateGeminiText, type GeminiConversationMessage } from './gemini'
import { getPhilosopherSystemPrompt } from './prompts'
import type { Message, Philosopher } from '../types'

type DetectedFallacy = {
  type: string
  quote: string
  explanation: string
}

type DetectedFactualClaim = {
  claim: string
  context: string
}

type DebateResult = {
  response: string
  fallacies: DetectedFallacy[]
  factualClaims: DetectedFactualClaim[]
}

function toGeminiConversation(messages: Message[]): GeminiConversationMessage[] {
  return messages.map((message) => ({
    role: message.role === 'user' ? 'user' : 'model',
    text: message.content,
  }))
}

function parseGeminiJson(rawText: string): DebateResult | null {
  const trimmed = rawText.trim()
  if (!trimmed) {
    return null
  }

  const stripped = trimmed
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim()

  const firstBrace = stripped.indexOf('{')
  const lastBrace = stripped.lastIndexOf('}')
  const candidate =
    firstBrace >= 0 && lastBrace > firstBrace
      ? stripped.slice(firstBrace, lastBrace + 1)
      : stripped

  const parsed: unknown = JSON.parse(candidate)
  if (typeof parsed !== 'object' || parsed === null) {
    return null
  }

  const record = parsed as Record<string, unknown>
  const response = typeof record.response === 'string' ? record.response : ''

  const fallacies: DetectedFallacy[] = Array.isArray(record.fallacies)
    ? record.fallacies
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return null
          }
          const value = item as Record<string, unknown>
          if (
            typeof value.type !== 'string' ||
            typeof value.quote !== 'string' ||
            typeof value.explanation !== 'string'
          ) {
            return null
          }
          return {
            type: value.type,
            quote: value.quote,
            explanation: value.explanation,
          }
        })
        .filter((item): item is DetectedFallacy => item !== null)
    : []

  const factualClaims: DetectedFactualClaim[] = Array.isArray(record.factualClaims)
    ? record.factualClaims
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return null
          }
          const value = item as Record<string, unknown>
          if (typeof value.claim !== 'string' || typeof value.context !== 'string') {
            return null
          }
          return {
            claim: value.claim,
            context: value.context,
          }
        })
        .filter((item): item is DetectedFactualClaim => item !== null)
    : []

  if (!response.trim()) {
    return null
  }

  return {
    response,
    fallacies,
    factualClaims,
  }
}

export async function getPhilosopherResponse(
  messages: Message[],
  philosopher: Philosopher,
  topic: string,
): Promise<DebateResult> {
  const systemPrompt = getPhilosopherSystemPrompt(philosopher, topic)
  const conversation = toGeminiConversation(messages)

  const rawText = await generateGeminiText({
    systemPrompt,
    contents: conversation,
  })

  if (rawText.startsWith('ERROR:')) {
    throw new Error(rawText)
  }

  try {
    const parsed = parseGeminiJson(rawText)
    if (parsed) {
      return parsed
    }
  } catch {
    // Fall through to tolerant text-only fallback.
  }

  return {
    response: rawText,
    fallacies: [],
    factualClaims: [],
  }
}
