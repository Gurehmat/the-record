import { create } from 'zustand'

import type {
  DebateMode,
  DebateState,
  FactualClaim,
  FactCheck,
  Fallacy,
  Message,
  RecordSpeakerId,
  SetupConfig,
} from '../types'

type DebateStoreState = {
  config: SetupConfig
  debateState: DebateState
  messages: Message[]
  fallacies: Fallacy[]
  activeFallacyModal: Fallacy | null
  factChecks: FactCheck[]
  factualClaims: FactualClaim[]
  isLoading: boolean
  isPhilosopherSpeaking: boolean
  activeSpeaker: RecordSpeakerId
  isRecording: boolean
  recordingStartTime: number
  recordingEndTime: number
  recordStopHandler: (() => void) | null
}

type DebateStore = DebateStoreState & {
  setMode: (mode: DebateMode) => void
  setConfig: (config: Partial<SetupConfig>) => void
  addMessage: (message: Message) => void
  flagMessage: (id: string) => void
  addFallacy: (fallacy: Fallacy) => void
  showFallacyModal: (fallacy: Fallacy) => void
  dismissFallacyModal: () => void
  addFactCheck: (factCheck: FactCheck) => void
  updateFactCheck: (id: string, updates: Partial<FactCheck>) => void
  addFactualClaims: (factualClaims: FactualClaim[]) => void
  setIsLoading: (isLoading: boolean) => void
  setIsPhilosopherSpeaking: (isSpeaking: boolean) => void
  setActiveSpeaker: (speaker: RecordSpeakerId) => void
  setIsRecording: (isRecording: boolean) => void
  setRecordStopHandler: (handler: (() => void) | null) => void
  setDebateState: (debateState: DebateState) => void
  reset: () => void
}

const createInitialState = (): DebateStoreState => ({
  config: {
    mode: 'forum',
    speaker1: '',
    speaker2: '',
    topic: '',
    philosopher: null,
    inputMode: 'text',
  },
  debateState: 'setup',
  messages: [],
  fallacies: [],
  activeFallacyModal: null,
  factChecks: [],
  factualClaims: [],
  isLoading: false,
  isPhilosopherSpeaking: false,
  activeSpeaker: 'speaker1',
  isRecording: false,
  recordingStartTime: 0,
  recordingEndTime: 0,
  recordStopHandler: null,
})

export const useDebateStore = create<DebateStore>((set) => ({
  ...createInitialState(),
  setMode: (mode) =>
    set((state) => ({
      config: {
        ...state.config,
        mode,
      },
    })),
  setConfig: (config) =>
    set((state) => ({
      config: {
        ...state.config,
        ...config,
      },
    })),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  flagMessage: (id) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, flagged: true } : message,
      ),
    })),
  addFallacy: (fallacy) =>
    set((state) => ({
      fallacies: [...state.fallacies, fallacy],
    })),
  showFallacyModal: (fallacy) => set({ activeFallacyModal: fallacy }),
  dismissFallacyModal: () => set({ activeFallacyModal: null }),
  addFactCheck: (factCheck) =>
    set((state) => ({
      factChecks: [...state.factChecks, factCheck],
    })),
  updateFactCheck: (id, updates) =>
    set((state) => ({
      factChecks: state.factChecks.map((factCheck) =>
        factCheck.id === id ? { ...factCheck, ...updates } : factCheck,
      ),
    })),
  addFactualClaims: (factualClaims) =>
    set((state) => ({
      factualClaims: [...state.factualClaims, ...factualClaims],
    })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsPhilosopherSpeaking: (isSpeaking) => set({ isPhilosopherSpeaking: isSpeaking }),
  setActiveSpeaker: (activeSpeaker) => set({ activeSpeaker }),
  setIsRecording: (isRecording) =>
    set((state) => ({
      isRecording,
      recordingStartTime:
        isRecording && state.config.mode === 'record' && state.recordingStartTime === 0
          ? Date.now()
          : state.recordingStartTime,
      recordingEndTime:
        isRecording && state.config.mode === 'record' ? 0 : state.recordingEndTime,
    })),
  setRecordStopHandler: (recordStopHandler) => set({ recordStopHandler }),
  setDebateState: (debateState) =>
    set((state) => {
      if (debateState === 'live' && state.config.mode === 'record') {
        return {
          debateState,
          activeSpeaker: 'speaker1',
          isRecording: false,
          recordingStartTime: 0,
          recordingEndTime: 0,
        }
      }

      if (debateState !== 'live') {
        return {
          debateState,
          isRecording: false,
          recordingEndTime:
            state.config.mode === 'record' && state.recordingStartTime > 0
              ? Date.now()
              : state.recordingEndTime,
        }
      }

      return { debateState }
    }),
  reset: () => set(createInitialState()),
}))
