import { requestSpeechAudio } from './elevenlabs'

const ADAM_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'

let activeAudio: HTMLAudioElement | null = null
let activeObjectUrl: string | null = null
let currentlySpeaking = false
let playbackRequestId = 0
let pingAudioContext: AudioContext | null = null

function cleanupPlayback() {
  if (activeAudio) {
    activeAudio.onended = null
    activeAudio.onerror = null
    activeAudio.pause()
    activeAudio.src = ''
    activeAudio.load()
    activeAudio = null
  }

  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl)
    activeObjectUrl = null
  }

  currentlySpeaking = false
}

async function fetchSpeechWithFallback(text: string, voiceId: string): Promise<Blob> {
  try {
    return await requestSpeechAudio({ text, voiceId })
  } catch (error) {
    if (voiceId === ADAM_VOICE_ID) {
      throw error
    }

    return requestSpeechAudio({ text, voiceId: ADAM_VOICE_ID })
  }
}

export async function speakText(text: string, voiceId: string): Promise<void> {
  stopSpeaking()
  const requestId = playbackRequestId

  const audioBlob = await fetchSpeechWithFallback(text, voiceId)
  if (requestId !== playbackRequestId) {
    return
  }

  const objectUrl = URL.createObjectURL(audioBlob)
  const audio = new Audio(objectUrl)
  activeAudio = audio
  activeObjectUrl = objectUrl
  currentlySpeaking = true

  await new Promise<void>((resolve, reject) => {
    audio.onended = () => {
      if (requestId === playbackRequestId) {
        cleanupPlayback()
      }
      resolve()
    }

    audio.onerror = () => {
      const message =
        audio.error?.message?.trim() || 'Failed to play ElevenLabs audio stream'
      cleanupPlayback()
      reject(new Error(message))
    }

    audio.play().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown audio play error'
      cleanupPlayback()
      reject(new Error(message))
    })
  })
}

export function stopSpeaking(): void {
  playbackRequestId += 1
  cleanupPlayback()
}

export function isSpeaking(): boolean {
  return currentlySpeaking
}

export async function playFallacyPing(): Promise<void> {
  if (typeof window === 'undefined') {
    return
  }

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext
  if (!AudioContextConstructor) {
    return
  }

  try {
    if (!pingAudioContext || pingAudioContext.state === 'closed') {
      pingAudioContext = new AudioContextConstructor()
    }

    if (pingAudioContext.state === 'suspended') {
      await pingAudioContext.resume()
    }

    const context = pingAudioContext
    const startAt = context.currentTime
    const endAt = startAt + 0.2

    const oscillator = context.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(440, startAt)

    const gainNode = context.createGain()
    gainNode.gain.setValueAtTime(0.22, startAt)
    gainNode.gain.linearRampToValueAtTime(0.0001, endAt)

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.start(startAt)
    oscillator.stop(endAt)
  } catch {
    // Ignore ping playback failures to keep modal interactions responsive.
  }
}
