import clsx from 'clsx'
import type { KeyboardEvent, MouseEventHandler, ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  selected?: boolean
}

export function Card({
  children,
  className,
  onClick,
  selected = false,
}: CardProps) {
  const isInteractive = onClick !== undefined

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive || (event.key !== 'Enter' && event.key !== ' ')) {
      return
    }

    event.preventDefault()
    event.currentTarget.click()
  }

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={clsx(
        'border-[3px] bg-parchment p-5 shadow-brutal transition-all duration-100 hover:shadow-brutal-lg',
        selected
          ? 'border-accent shadow-brutal-red hover:scale-[1.01] hover:shadow-[6px_6px_0_0_#C8102E]'
          : 'border-ink',
        isInteractive && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-parchment',
        className,
      )}
    >
      {children}
    </div>
  )
}
