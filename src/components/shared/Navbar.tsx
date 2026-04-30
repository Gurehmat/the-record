import { useEffect, useState } from 'react'

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
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-1 sm:gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
            END PROCEEDINGS?
          </span>
          <button
            type="button"
            onClick={handleConfirmEndSession}
            className="min-h-11 border-2 border-accent bg-accent px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white sm:min-h-0 sm:py-1"
          >
            CONFIRM
          </button>
          <button
            type="button"
            aria-label="Cancel end session"
            onClick={() => setShowEndConfirm(false)}
            className="min-h-11 border-2 border-accent bg-transparent px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-accent hover:bg-accent hover:text-white sm:min-h-0 sm:px-2 sm:py-1"
          >
            X
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowEndConfirm(true)}
          className="min-h-11 border-2 border-accent bg-transparent px-2 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-accent transition-colors hover:bg-accent hover:text-white sm:min-h-0 sm:px-4 sm:py-1 sm:text-xs sm:tracking-[0.12em]"
        >
          END SESSION
        </button>
      )
    ) : null

  if (isVerdict) {
    return (
      <header className="border-b-[3px] border-ink bg-parchment">
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center px-3 py-2 sm:px-6 sm:py-3">
          <p className="min-w-0 font-display text-lg font-bold uppercase tracking-[0.12em] text-ink sm:text-2xl sm:tracking-[0.18em]">
            THE RECORD
          </p>

          <nav className="hidden items-center justify-center sm:flex">
            <span className="border-b-[3px] border-ink pb-1 font-mono text-xs font-bold uppercase tracking-[0.22em] text-ink">
              SESSION
            </span>
          </nav>

          <div aria-hidden="true" />
        </div>
      </header>
    )
  }

  if (isLiveForum) {
    return (
      <header className="border-b-[3px] border-ink bg-ink">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3">
          <p className="min-w-0 truncate font-display text-base font-bold uppercase italic tracking-[0.06em] text-white sm:text-2xl sm:tracking-[0.08em]">
            THE RECORD <span className="hidden sm:inline">// FORUM // SESSION 001</span>
          </p>

          <nav className="hidden items-center gap-7 sm:flex">
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

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {endSessionControl}
            <div className="min-h-11 border border-white/60 bg-transparent px-2 py-[10px] font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-white sm:min-h-0 sm:px-3 sm:py-[8px] sm:text-xs sm:tracking-[0.16em]">
              <span className="text-accent sm:mr-2">REC</span><span className="hidden sm:inline">ON RECORD</span>
            </div>
          </div>
        </div>
      </header>
    )
  }

  if (isLiveRecord) {
    return (
      <header className="border-b-[3px] border-ink bg-ink">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3">
          <p className="min-w-0 truncate font-display text-base font-bold uppercase italic tracking-[0.06em] text-white sm:text-2xl sm:tracking-[0.08em]">
            THE RECORD{' '}
            <span className="hidden font-mono text-sm not-italic tracking-[0.16em] text-white/80 sm:inline sm:text-base">
              // SESSION 001 // {formatDuration(recordElapsedMs)}
            </span>
          </p>

          <nav className="hidden items-center gap-7 md:flex">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-white/60">
              LOGS
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-white/60">
              NETWORK
            </span>
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {endSessionControl}
            <div
              className={`min-h-11 border border-white/60 bg-transparent px-2 py-[10px] font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-white sm:min-h-0 sm:px-3 sm:py-[8px] sm:text-xs sm:tracking-[0.16em] ${
                isRecording ? 'record-on-air-pulse' : ''
              }`}
            >
              <span className={`${isRecording ? 'text-accent' : 'text-white/40'} sm:mr-2`}>
                REC
              </span>
              <span className="hidden sm:inline">{isRecording ? 'ON RECORD' : 'PAUSED'}</span>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b-[3px] border-ink bg-parchment">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3">
        <p className="min-w-0 font-display text-lg font-bold uppercase tracking-[0.12em] text-ink sm:text-2xl sm:tracking-[0.18em]">
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
        </div>
      </div>
    </header>
  )
}
