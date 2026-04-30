import clsx from 'clsx'
import { useId } from 'react'
import type { ChangeEvent, HTMLInputTypeAttribute } from 'react'

type InputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: HTMLInputTypeAttribute
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: InputProps) {
  const id = useId()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-ink">
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={clsx(
          'w-full rounded-none border-[3px] border-ink bg-parchment px-4 py-3 font-mono text-sm text-ink outline-none placeholder:text-ink/50',
          'focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-parchment',
        )}
      />
    </label>
  )
}
