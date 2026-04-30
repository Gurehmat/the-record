const GEMINI_MODEL = 'gemini-2.5-flash'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

/** Full resource path: .../models/gemini-2.5-flash:generateContent (colon before method). */
const GEMINI_GENERATE_CONTENT_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

let lastCallTime = 0
const MIN_DELAY_MS = 3000

export type GeminiConversationMessage = {
  role: 'user' | 'model'
  text: string
}

type GenerateGeminiTextInput = {
  systemPrompt?: string
  contents: GeminiConversationMessage[]
}

export class GeminiRateLimitError extends Error {
  status = 429

  constructor(message = 'Gemini rate limit exceeded') {
    super(message)
    this.name = 'GeminiRateLimitError'
  }
}

async function throttledGeminiCall<T>(callFn: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const timeSinceLastCall = now - lastCallTime

  if (timeSinceLastCall < MIN_DELAY_MS) {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, MIN_DELAY_MS - timeSinceLastCall)
    })
  }

  lastCallTime = Date.now()
  return callFn()
}

export function isRateLimitError(err: unknown): boolean {
  if (err instanceof GeminiRateLimitError) {
    return true
  }

  if (typeof err === 'object' && err !== null) {
    const maybeStatus = 'status' in err ? (err as { status?: unknown }).status : undefined
    if (maybeStatus === 429) {
      return true
    }
  }

  const message = err instanceof Error ? err.message : String(err)
  return message.includes('429') || message.toLowerCase().includes('quota')
}

function formatConversation(contents: GeminiConversationMessage[]): string {
  return contents
    .map((message) => {
      const speaker = message.role === 'model' ? 'ASSISTANT' : 'USER'
      return `${speaker}: ${message.text}`
    })
    .join('\n\n')
}

function extractTextFromGenerateContent(data: unknown): string {
  if (typeof data !== 'object' || data === null) {
    return ''
  }

  const candidates = (data as { candidates?: unknown }).candidates
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return ''
  }

  const first = candidates[0]
  if (typeof first !== 'object' || first === null) {
    return ''
  }

  const content = (first as { content?: unknown }).content
  if (typeof content !== 'object' || content === null) {
    return ''
  }

  const parts = (content as { parts?: unknown }).parts
  if (!Array.isArray(parts)) {
    return ''
  }

  return parts
    .map((part) => {
      if (typeof part !== 'object' || part === null) {
        return ''
      }
      const text = (part as { text?: unknown }).text
      return typeof text === 'string' ? text : ''
    })
    .join('')
}

export async function generateGeminiText({
  systemPrompt,
  contents,
}: GenerateGeminiTextInput): Promise<string> {
  if (!API_KEY || String(API_KEY).trim().length === 0) {
    return 'ERROR: Missing VITE_GEMINI_API_KEY'
  }

  const key = String(API_KEY).trim()
  const url = `${GEMINI_GENERATE_CONTENT_URL}?key=${encodeURIComponent(key)}`

  const userSections: string[] = []
  if (contents.length > 0) {
    userSections.push(`CONVERSATION:\n${formatConversation(contents)}`)
  }
  userSections.push('Respond now.')
  const userText = userSections.join('\n\n')

  const body: {
    systemInstruction?: { parts: { text: string }[] }
    contents: { role: string; parts: { text: string }[] }[]
  } = {
    contents: [{ role: 'user', parts: [{ text: userText }] }],
  }

  if (systemPrompt && systemPrompt.trim().length > 0) {
    body.systemInstruction = { parts: [{ text: systemPrompt.trim() }] }
  }

  try {
    const response = await throttledGeminiCall(() =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    )

    if (response.status === 429) {
      throw new GeminiRateLimitError()
    }

    const rawJson: unknown = await response.json()

    if (!response.ok) {
      let detail = response.statusText
      if (typeof rawJson === 'object' && rawJson !== null) {
        const message = (rawJson as { error?: { message?: string } }).error?.message
        if (typeof message === 'string' && message.length > 0) {
          detail = message
        }
      }
      throw new Error(`ERROR: ${detail} (${response.status})`)
    }

    const responseText = extractTextFromGenerateContent(rawJson)
    if (responseText.trim().length > 0) {
      return responseText
    }

    return `ERROR: Gemini returned no text response for ${GEMINI_MODEL}`
  } catch (err: unknown) {
    if (isRateLimitError(err)) {
      throw err instanceof GeminiRateLimitError
        ? err
        : new GeminiRateLimitError(err instanceof Error ? err.message : undefined)
    }

    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(`ERROR: ${message} (model: ${GEMINI_MODEL})`, {
      cause: err,
    })
  }
}

export async function testGemini(): Promise<string> {
  return generateGeminiText({
    contents: [
      {
        role: 'user',
        text: 'In one short sentence, confirm the proceedings are ready to begin.',
      },
    ],
  })
}
