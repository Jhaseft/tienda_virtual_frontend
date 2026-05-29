"use client"

import { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react"

interface Props {
  value: string[]
  onChange: (val: string[]) => void
}

export default function OtpInput({ value, onChange }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const digit = e.target.value.replace(/\D/g, "").slice(-1)
    const next = [...value]
    next[index] = digit
    onChange(next)
    if (digit && index < 5) refs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      const next = [...value]
      if (next[index]) {
        next[index] = ""
        onChange(next)
      } else if (index > 0) {
        refs.current[index - 1]?.focus()
      }
    }
    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus()
    if (e.key === "ArrowRight" && index < 5) refs.current[index + 1]?.focus()
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const next = [...value]
    for (let i = 0; i < digits.length; i++) next[i] = digits[i]
    onChange(next)
    refs.current[Math.min(digits.length, 5)]?.focus()
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-13 text-center text-xl font-semibold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-600 transition-colors bg-white"
          style={{ height: "3.25rem" }}
        />
      ))}
    </div>
  )
}
