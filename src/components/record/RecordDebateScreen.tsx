import { useMemo, useState } from 'react'

import { FallacyModal } from '../shared/FallacyModal'
import { useRecordDebate } from '../../hooks/useRecordDebate'
import { useDebateStore } from '../../store/useDebateStore'
import type { FactCheck, Fallacy, Message, RecordSpeakerId } from '../../types'
import { LiveTranscriptPanel } from './LiveTranscriptPanel'
import { RecordFactCheckPanel } from './RecordFactCheckPanel'
import { RecordFallacyPanel } from './RecordFallacyPanel'
import type { RecordTranscriptMessage } from './recordTypes'
import { SpeakerColumn } from './SpeakerColumn'
import { SpeakerToggle } from './SpeakerToggle'

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

function speakerLabel(
  speakerId: RecordSpeakerId,
  speakerAName: string,
  speakerBName: string,
) {
  return speakerId === 'speaker1' ? speakerAName : speakerBName
}

function getMessageSpeakerId(message: Message): RecordSpeakerId | null {
  if (message.speakerId) {
    return message.speakerId
  }

  if (message.role === 'user') {
    return 'speaker1'
  }

  if (message.role === 'philosopher') {
    return 'speaker2'
  }

  return null
}

function fallacyBelongsToSpeaker(
  fallacy: Fallacy,
  speakerId: RecordSpeakerId,
  speakerName: string,
) {
  const speaker = normalizeText(fallacy.speaker)
  const genericName = speakerId === 'speaker1' ? 'speaker a' : 'speaker b'

  return speaker === normalizeText(speakerName) || speaker === genericName
}

function factCheckBelongsToSpeaker(
  factCheck: FactCheck,
  speakerId: RecordSpeakerId,
  speakerName: string,
) {
  if (!factCheck.speaker) {
    return speakerId === 'speaker1'
  }

  const speaker = normalizeText(factCheck.speaker)
  const genericName = speakerId === 'speaker1' ? 'speaker a' : 'speaker b'

  return speaker === normalizeText(speakerName) || speaker === genericName
}

function messageIsFlagged(
  message: Message,
  speakerId: RecordSpeakerId,
  speakerName: string,
  fallacies: Fallacy[],
) {
  if (message.flagged) {
    return true
  }

  const content = normalizeText(message.content)

  return fallacies.some((fallacy) => {
    if (!fallacyBelongsToSpeaker(fallacy, speakerId, speakerName)) {
      return false
    }

    const quote = normalizeText(fallacy.quote)
    const timestampsAreClose = Math.abs(fallacy.timestamp - message.timestamp) < 5000

    return (quote.length > 0 && content.includes(quote)) || timestampsAreClose
  })
}

function calculateCredibilityScore(
  speakerId: RecordSpeakerId,
  speakerName: string,
  fallacies: Fallacy[],
  factChecks: FactCheck[],
) {
  const fallacyPenalty = fallacies
    .filter((fallacy) => fallacyBelongsToSpeaker(fallacy, speakerId, speakerName))
    .reduce((total, fallacy) => {
      if (fallacy.severity === 'high') {
        return total + 14
      }

      if (fallacy.severity === 'medium') {
        return total + 10
      }

      return total + 6
    }, 0)

  const factPenalty = factChecks
    .filter((factCheck) =>
      factCheckBelongsToSpeaker(factCheck, speakerId, speakerName),
    )
    .reduce((total, factCheck) => {
      if (factCheck.verdict === 'false') {
        return total + 12
      }

      if (factCheck.verdict === 'misleading') {
        return total + 7
      }

      return total
    }, 0)

  return Math.max(0, Math.min(100, 100 - fallacyPenalty - factPenalty))
}

export function RecordDebateScreen() {
  const [showOverlay, setShowOverlay] = useState(true)
  const messages = useDebateStore((state) => state.messages)
  const fallacies = useDebateStore((state) => state.fallacies)
  const factChecks = useDebateStore((state) => state.factChecks)
  const speakerAName = useDebateStore((state) => state.config.speaker1.trim() || 'Speaker A')
  const speakerBName = useDebateStore((state) => state.config.speaker2.trim() || 'Speaker B')
  const activeFallacyModal = useDebateStore((state) => state.activeFallacyModal)
  const dismissFallacyModal = useDebateStore((state) => state.dismissFallacyModal)
  const addMessage = useDebateStore((state) => state.addMessage)
  const {
    startRecording,
    pauseRecording,
    resumeRecording,
    isRecording,
    interimText,
    error,
    activeSpeaker,
    setActiveSpeaker,
  } = useRecordDebate()
  const showHttpsWarning =
    typeof window !== 'undefined' && window.location.protocol !== 'https:'

  const transcriptMessages = useMemo<RecordTranscriptMessage[]>(() => {
    return messages
      .map((message) => {
        const speakerId = getMessageSpeakerId(message)

        if (!speakerId) {
          return null
        }

        const name = speakerLabel(speakerId, speakerAName, speakerBName)

        return {
          id: message.id,
          content: message.content,
          timestamp: message.timestamp,
          speakerId,
          speakerName: name,
          isFlagged: messageIsFlagged(message, speakerId, name, fallacies),
        }
      })
      .filter((message): message is RecordTranscriptMessage => message !== null)
      .sort((first, second) => first.timestamp - second.timestamp)
  }, [fallacies, messages, speakerAName, speakerBName])

  const speakerAMessages = transcriptMessages.filter(
    (message) => message.speakerId === 'speaker1',
  )
  const speakerBMessages = transcriptMessages.filter(
    (message) => message.speakerId === 'speaker2',
  )

  const handleResume = () => {
    dismissFallacyModal()
  }

  const handleBeginRecording = () => {
    setShowOverlay(false)
    void startRecording()
  }

  const handleResumeRecording = () => {
    setShowOverlay(false)
    resumeRecording()
  }

  const handleDispute = () => {
    dismissFallacyModal()
    addMessage({
      id: `system-dispute-${Date.now()}`,
      role: 'system',
      content: 'FLAG DISPUTED BY PARTICIPANT - PROCEEDINGS CONTINUE',
      timestamp: Date.now(),
    })
  }

  return (
    <>
      <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-[1600px] flex-col gap-3 overflow-visible px-3 py-3 lg:h-[calc(100vh-72px)] lg:overflow-hidden">
        {showHttpsWarning ? (
          <div className="border-[3px] border-accent bg-[#FDE2E2] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-accent shadow-brutal">
            Record mode requires HTTPS - deploy to Vercel or use Chrome flag
          </div>
        ) : null}

        {error ? (
          <div className="border-[3px] border-ink bg-[#FFF7B8] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink shadow-brutal">
            {error}
          </div>
        ) : null}

        <section className="flex flex-col overflow-visible lg:min-h-[360px] lg:basis-[55%] lg:overflow-hidden">
          <div className="grid grid-cols-1 gap-3 overflow-visible lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:overflow-hidden">
            <SpeakerColumn
              speakerName={speakerAName}
              isActive={activeSpeaker === 'speaker1' && isRecording}
              messages={speakerAMessages}
              interimText={activeSpeaker === 'speaker1' ? interimText : ''}
              credibilityScore={calculateCredibilityScore(
                'speaker1',
                speakerAName,
                fallacies,
                factChecks,
              )}
            />
            <SpeakerColumn
              speakerName={speakerBName}
              isActive={activeSpeaker === 'speaker2' && isRecording}
              messages={speakerBMessages}
              interimText={activeSpeaker === 'speaker2' ? interimText : ''}
              credibilityScore={calculateCredibilityScore(
                'speaker2',
                speakerBName,
                fallacies,
                factChecks,
              )}
            />
          </div>
          <SpeakerToggle
            activeSpeaker={activeSpeaker}
            isRecording={isRecording}
            onSelectSpeaker={setActiveSpeaker}
            onPauseRecording={pauseRecording}
            onResumeRecording={handleResumeRecording}
          />
        </section>

        <section className="grid grid-cols-1 gap-3 overflow-visible lg:min-h-[260px] lg:basis-[45%] lg:grid-cols-3 lg:overflow-hidden">
          <RecordFallacyPanel />
          <LiveTranscriptPanel messages={transcriptMessages} />
          <RecordFactCheckPanel />
        </section>

        {activeFallacyModal && (
          <FallacyModal
            fallacy={activeFallacyModal}
            onResume={handleResume}
            onDispute={handleDispute}
          />
        )}
      </main>

      {showOverlay ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <button
            type="button"
            onClick={handleBeginRecording}
            className="inline-flex items-center justify-center border-[4px] border-ink bg-[#C8102E] px-16 py-6 font-mono text-2xl font-bold uppercase tracking-[0.18em] text-white shadow-[6px_6px_0_0_#1A1A1A] transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Begin Recording
          </button>
        </div>
      ) : null}
    </>
  )
}
