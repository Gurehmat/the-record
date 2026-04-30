export type DebateMode = 'record' | 'forum'

export type Philosopher = {
  id: string
  name: string
  title: string
  era: string
  style: string
  voiceId: string
  avatar: string
}

export type InputMode = 'text' | 'voice'

export type RecordSpeakerId = 'speaker1' | 'speaker2'

export type SetupConfig = {
  mode: DebateMode
  speaker1: string
  speaker2: string
  topic: string
  philosopher: Philosopher | null
  inputMode: InputMode
}

export type Message = {
  id: string
  role: 'user' | 'philosopher' | 'system'
  content: string
  timestamp: number
  speaker?: string
  speakerId?: RecordSpeakerId
  audioUrl?: string
  flagged?: boolean
}

export type Fallacy = {
  id: string
  type: string
  description: string
  quote: string
  speaker: string
  timestamp: number
  severity: 'low' | 'medium' | 'high'
}

export type FactCheck = {
  id: string
  claim: string
  verdict: 'true' | 'false' | 'misleading' | 'unverifiable' | 'rate_limited'
  explanation: string
  sources: string[]
  timestamp: number
  status: 'pending' | 'complete'
  speaker?: string
}

export type FactualClaim = {
  claim: string
  context: string
}

export type DebateState = 'setup' | 'live' | 'verdict'
