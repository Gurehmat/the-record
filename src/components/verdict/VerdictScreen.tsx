import { useEffect, useRef, useState } from 'react'

import { useDebateStore } from '../../store/useDebateStore'
import { ForumVerdict } from './ForumVerdict'
import { RecordVerdict } from './RecordVerdict'

export type VerdictActions = {
  onDownloadPdf: () => void
  onShareLink: () => void
  shareLabel: string
}

export function VerdictScreen() {
  const mode = useDebateStore((state) => state.config.mode)
  const [shareLabel, setShareLabel] = useState('SHARE LINK')
  const resetShareTimeoutRef = useRef<number | null>(null)

  const handleDownloadPdf = () => {
    window.print()
  }

  const handleShareLink = () => {
    void (async () => {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setShareLabel('\u2713 COPIED')

        if (resetShareTimeoutRef.current) {
          window.clearTimeout(resetShareTimeoutRef.current)
        }

        resetShareTimeoutRef.current = window.setTimeout(() => {
          setShareLabel('SHARE LINK')
          resetShareTimeoutRef.current = null
        }, 2000)
      } catch {
        setShareLabel('SHARE LINK')
      }
    })()
  }

  useEffect(() => {
    return () => {
      if (resetShareTimeoutRef.current) {
        window.clearTimeout(resetShareTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {mode === 'record' ? (
        <RecordVerdict
          onDownloadPdf={handleDownloadPdf}
          onShareLink={handleShareLink}
          shareLabel={shareLabel}
        />
      ) : (
        <ForumVerdict
          onDownloadPdf={handleDownloadPdf}
          onShareLink={handleShareLink}
          shareLabel={shareLabel}
        />
      )}
    </>
  )
}
