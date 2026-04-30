import type { RecordSpeakerId } from '../../types'

export type RecordTranscriptMessage = {
  id: string
  content: string
  timestamp: number
  speakerId: RecordSpeakerId
  speakerName: string
  isFlagged: boolean
}
