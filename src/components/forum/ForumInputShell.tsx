import type { ReactNode } from 'react'

type ForumInputShellProps = {
  children: ReactNode
}

export function ForumInputShell({ children }: ForumInputShellProps) {
  return (
    <div className="flex-shrink-0 border-t-[3px] border-ink bg-parchment px-3 py-3 sm:px-5 sm:py-4">
      <div className="mx-auto w-full max-w-[1600px]">{children}</div>
    </div>
  )
}
