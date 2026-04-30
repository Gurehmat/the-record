import { generateGeminiText, isRateLimitError } from './gemini'
import type { FactCheck } from '../types'

export const FACT_CHECK_ENABLED = true

const FACT_CHECK_SYSTEM_PROMPT = `You are a fact-checker. Given a claim and its context,
use Google Search to verify the claim. Respond in JSON:
{
  "verdict": "true" | "false" | "misleading" | "unverifiable",
  "explanation": "Brief explanation of your finding",
  "sources": ["source URLs or names"]
}
Be concise. Stick to facts.`

const FALLBACK_EXPLANATION = 'Unable to verify at this time'
const RATE_LIMIT_EXPLANATION = 'Fact-check deferred due to Gemini rate limits.'

type FactCheckVerdict = FactCheck['verdict']

function createFactCheck(
  claim: string,
  verdict: FactCheckVerdict,
  explanation: string,
  sources: string[] = [],
): FactCheck {
  return {
    id: `factcheck-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    claim,
    verdict,
    explanation,
    sources,
    timestamp: Date.now(),
    status: 'complete',
  }
}

export function toRateLimitedFactCheck(claim: string): FactCheck {
  return createFactCheck(claim, 'rate_limited', RATE_LIMIT_EXPLANATION)
}

function toFallbackFactCheck(claim: string): FactCheck {
  return createFactCheck(claim, 'unverifiable', FALLBACK_EXPLANATION)
}

function parseJsonObject(rawText: string): Record<string, unknown> | null {
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
    firstBrace >= 0 && lastBrace > firstBrace ? stripped.slice(firstBrace, lastBrace + 1) : stripped

  try {
    const parsed: unknown = JSON.parse(candidate)
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : null
  } catch {
    return null
  }
}

function normalizeVerdict(value: unknown): FactCheckVerdict {
  if (
    value === 'true' ||
    value === 'false' ||
    value === 'misleading' ||
    value === 'unverifiable' ||
    value === 'rate_limited'
  ) {
    return value
  }

  return 'unverifiable'
}

function toSources(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

function parseFactCheckResponse(rawText: string, claim: string): FactCheck {
  const parsed = parseJsonObject(rawText)
  if (!parsed) {
    return toFallbackFactCheck(claim)
  }

  const explanation =
    typeof parsed.explanation === 'string' && parsed.explanation.trim().length > 0
      ? parsed.explanation.trim()
      : FALLBACK_EXPLANATION

  return createFactCheck(claim, normalizeVerdict(parsed.verdict), explanation, toSources(parsed.sources))
}

export async function factCheckClaim(claim: string, context: string): Promise<FactCheck> {
  if (!FACT_CHECK_ENABLED) {
    return toFallbackFactCheck(claim)
  }

  try {
    const responseText = await generateGeminiText({
      systemPrompt: FACT_CHECK_SYSTEM_PROMPT,
      contents: [
        {
          role: 'user',
          text: [
            `CLAIM:\n${claim}`,
            `CONTEXT:\n${context.trim() || 'No additional context provided.'}`,
            'Respond with JSON only.',
          ].join('\n\n'),
        },
      ],
    })

    if (!responseText || responseText.startsWith('ERROR:')) {
      return toFallbackFactCheck(claim)
    }

    return parseFactCheckResponse(responseText, claim)
  } catch (err: unknown) {
    if (isRateLimitError(err)) {
      return toRateLimitedFactCheck(claim)
    }
    return toFallbackFactCheck(claim)
  }
}
