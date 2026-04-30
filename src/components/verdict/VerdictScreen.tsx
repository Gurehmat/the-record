import { useEffect, useState } from 'react'

import { useDebateStore } from '../../store/useDebateStore'
import { ForumVerdict } from './ForumVerdict'
import { RecordVerdict } from './RecordVerdict'

export type VerdictActions = {
  onDownloadPdf: () => void
  onShareLink: () => void
}

export function VerdictScreen() {
  const mode = useDebateStore((state) => state.config.mode)
  const [toastMessage, setToastMessage] = useState('')

  const handleDownloadPdf = () => {
    window.print()
  }

  const handleShareLink = () => {
    void (async () => {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setToastMessage('LINK COPIED')
      } catch {
        setToastMessage('COPY FAILED')
      }
    })()
  }

  useEffect(() => {
    if (!toastMessage) {
      return
    }

    const timeout = window.setTimeout(() => {
      setToastMessage('')
    }, 2000)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [toastMessage])

  return (
    <>
      {mode === 'record' ? (
        <RecordVerdict onDownloadPdf={handleDownloadPdf} onShareLink={handleShareLink} />
      ) : (
        <ForumVerdict onDownloadPdf={handleDownloadPdf} onShareLink={handleShareLink} />
      )}

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 border-[3px] border-ink bg-parchment px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent shadow-brutal">
          {toastMessage}
        </div>
      )}
    </>
  )
}
