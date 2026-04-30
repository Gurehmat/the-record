const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'

type ElevenLabsSpeechRequest = {
  text: string
  voiceId: string
}

export async function requestSpeechAudio({
  text,
  voiceId,
}: ElevenLabsSpeechRequest): Promise<Blob> {
  const apiKey: string | undefined = import.meta.env.VITE_ELEVENLABS_API_KEY

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('Missing VITE_ELEVENLABS_API_KEY')
  }

  const response: Response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_flash_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    },
  )

  if (!response.ok) {
    const statusMessage =
      response.statusText.trim().length > 0
        ? response.statusText
        : `HTTP ${response.status}`
    throw new Error(`ElevenLabs request failed: ${statusMessage}`)
  }

  return response.blob()
}

export async function testElevenLabs(): Promise<string> {
  try {
    const audioBlob = await requestSpeechAudio({
      text: 'The proceedings are now in session.',
      voiceId: DEFAULT_VOICE_ID,
    })
    const objectUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(objectUrl)

    audio.onended = () => {
      URL.revokeObjectURL(objectUrl)
    }

    await audio.play()
    return 'Audio played successfully'
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return `ERROR: ${message}`
  }
}

