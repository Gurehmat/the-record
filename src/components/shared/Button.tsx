import clsx from 'clsx'
import type { MouseEventHandler, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  className?: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-4 text-base',
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-[3px] border-ink bg-accent text-white shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none',
  secondary:
    'border-[3px] border-ink bg-parchment text-ink shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none',
  ghost:
    'bg-transparent text-ink underline-offset-4 hover:underline active:translate-x-0.5 active:translate-y-0.5',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  disabled = false,
  className,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider transition-all duration-100 disabled:cursor-not-allowed disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        variant !== 'ghost' && 'rounded-none',
        className,
      )}
    >
      {children}
    </button>
  )
}
