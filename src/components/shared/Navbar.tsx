import { useEffect, useState } from 'react'
import { History, Landmark, PenLine, Rss, Settings } from 'lucide-react'

import { useDebateStore } from '../../store/useDebateStore'
import type { DebateMode, DebateState } from '../../types'

type NavbarProps = {
  mode: DebateMode
  debateState: DebateState
}

export function Navbar({ mode, debateState }: NavbarProps) {
  const isLiveForum = debateState === 'live' && mode === 'forum'
  const isLiveRecord = debateState === 'live' && mode === 'record'
  const isVerdict = debateState === 'verdict'
  const inputMode = useDebateStore((state) => state.config.inputMode)
  const isRecording = useDebateStore((state) => state.isRecording)
  const recordingStartTime = useDebateStore((state) => state.recordingStartTime)
  const recordStopHandler = useDebateStore((state) => state.recordStopHandler)
  const setDebateState = useDebateStore((state) => state.setDebateState)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    if (!isLiveRecord || recordingStartTime === 0) {
      return undefined
    }

    const updateElapsed = () => {
      setElapsedMs(Math.max(0, Date.now() - recordingStartTime))
    }

    const animationFrameId = window.requestAnimationFrame(updateElapsed)
    const timerId = window.setInterval(updateElapsed, 1000)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.clearInterval(timerId)
    }
  }, [isLiveRecord, recordingStartTime])

  const formatDuration = (durationMs: number) => {
    const totalSeconds = Math.floor(durationMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [hours, minutes, seconds]
      .map((part) => part.toString().padStart(2, '0'))
      .join(':')
  }

  const handleConfirmEndSession = () => {
    if (isLiveRecord) {
      recordStopHandler?.()
    }

    setShowEndConfirm(false)
    setDebateState('verdict')
  }

  const recordElapsedMs =
    isLiveRecord && recordingStartTime > 0 ? elapsedMs : 0

  const endSessionControl =
    debateState === 'live' ? (
      showEndConfirm ? (
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
            END PROCEEDINGS?
          </span>
          <button
            type="button"
            onClick={handleConfirmEndSession}
            className="border-2 border-accent bg-accent px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white"
          >
            CONFIRM
          </button>
          <button
            type="button"
            aria-label="Cancel end session"
            onClick={() => setShowEndConfirm(false)}
            className="border-2 border-accent bg-transparent px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-accent hover:bg-accent hover:text-white"
          >
            X
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowEndConfirm(true)}
          className="border-2 border-accent bg-transparent px-4 py-1 font-mono text-xs font-bold uppercase tracking-[0.12em] text-accent transition-colors hover:bg-accent hover:text-white"
        >
          END SESSION
        </button>
      )
    ) : null

  if (isVerdict) {
    return (
      <header className="border-b-[3px] border-ink bg-parchment">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <p className="font-display text-xl font-bold uppercase tracking-[0.18em] text-ink sm:text-2xl">
            THE RECORD
          </p>

          <nav className="hidden items-center sm:flex">
            <span className="border-b-[3px] border-ink pb-1 font-mono text-xs font-bold uppercase tracking-[0.22em] text-ink">
              SESSION
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5 text-ink" strokeWidth={2.5} />
            <History className="h-5 w-5 text-ink" strokeWidth={2.5} />
          </div>
        </div>
      </header>
    )
  }

  if (isLiveForum) {
    return (
      <header className="border-b-[3px] border-ink bg-ink">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <p className="min-w-0 truncate font-display text-lg font-bold uppercase italic tracking-[0.08em] text-white sm:text-2xl">
            THE RECORD // FORUM // SESSION 001
          </p>

          <nav className="hidden items-center gap-7 sm:flex">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-white/70">
              SESSION INFO
            </span>
            <span className="border border-white/20 bg-white/10 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
              INPUT: {inputMode.toUpperCase()}
            </span>
            <span className="border-b-[3px] border-accent pb-1 font-mono text-xs font-bold uppercase tracking-[0.24em] text-accent">
              LOGS
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-white/70">
              NETWORK
            </span>
          </nav>

          <div className="flex items-center gap-2">
            {endSessionControl}
            <div className="border border-white/60 bg-transparent px-3 py-[8px] font-mono text-xs font-bold uppercase tracking-[0.16em] text-white">
              <span className="mr-2 text-accent">REC</span>ON RECORD
            </div>
            <button
              type="button"
              aria-label="Notes"
              className="inline-flex h-10 w-10 items-center justify-center border-2 border-white/50 bg-transparent text-accent transition-all duration-100 hover:bg-white/10"
            >
              <PenLine className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              aria-label="Feed"
              className="inline-flex h-10 w-10 items-center justify-center border-2 border-white/50 bg-transparent text-accent transition-all duration-100 hover:bg-white/10"
            >
              <Rss className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>
    )
  }

  if (isLiveRecord) {
    return (
      <header className="border-b-[3px] border-ink bg-ink">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <p className="min-w-0 truncate font-display text-lg font-bold uppercase italic tracking-[0.08em] text-white sm:text-2xl">
            THE RECORD{' '}
            <span className="font-mono text-sm not-italic tracking-[0.16em] text-white/80 sm:text-base">
              // SESSION 001 // {formatDuration(recordElapsedMs)}
            </span>
          </p>

          <nav className="hidden items-center gap-7 md:flex">
            <span className="border-b-[3px] border-white pb-1 font-mono text-xs font-bold uppercase tracking-[0.24em] text-white">
              SESSION INFO
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-white/60">
              LOGS
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-white/60">
              NETWORK
            </span>
          </nav>

          <div className="flex items-center gap-2">
            {endSessionControl}
            <div
              className={`border border-white/60 bg-transparent px-3 py-[8px] font-mono text-xs font-bold uppercase tracking-[0.16em] text-white ${
                isRecording ? 'record-on-air-pulse' : ''
              }`}
            >
              <span className={`mr-2 ${isRecording ? 'text-accent' : 'text-white/40'}`}>
                REC
              </span>
              {isRecording ? 'ON RECORD' : 'PAUSED'}
            </div>
            <button
              type="button"
              aria-label="Settings"
              className="inline-flex h-10 w-10 items-center justify-center border-2 border-white/50 bg-transparent text-white transition-all duration-100 hover:bg-white/10"
            >
              <Settings className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              aria-label="Session history"
              className="inline-flex h-10 w-10 items-center justify-center border-2 border-white/50 bg-transparent text-white transition-all duration-100 hover:bg-white/10"
            >
              <History className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b-[3px] border-ink bg-parchment">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="font-display text-xl font-bold uppercase tracking-[0.18em] text-ink sm:text-2xl">
          THE RECORD
        </p>

        <nav className="hidden items-center gap-8 sm:flex">
          <span
            className={`border-b-[3px] pb-1 font-mono text-xs font-bold uppercase tracking-[0.22em] ${
              mode === 'record'
                ? 'border-ink text-ink'
                : 'border-transparent text-ink/80'
            }`}
          >
            RECORD MODE
          </span>
          <span
            className={`border-b-[3px] pb-1 font-mono text-xs font-bold uppercase tracking-[0.22em] ${
              mode === 'forum'
                ? 'border-ink text-ink'
                : 'border-transparent text-ink/80'
            }`}
          >
            FORUM MODE
          </span>
        </nav>

        <div className="flex items-center gap-2">
          {endSessionControl}
          <button
            type="button"
            aria-label="Notes"
            className="inline-flex h-10 w-10 items-center justify-center border-[3px] border-ink bg-parchment text-ink shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <PenLine className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="inline-flex h-10 w-10 items-center justify-center border-[3px] border-ink bg-parchment text-ink shadow-brutal transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <Settings className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  )
}
