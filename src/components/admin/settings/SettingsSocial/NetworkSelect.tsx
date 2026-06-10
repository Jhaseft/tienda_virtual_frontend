"use client"

import { useState, useRef, useEffect } from "react"
import type { SocialNetwork } from "@/types/admin"
import SocialIcon, { SOCIAL_NETWORK_LABELS } from "@/components/ui/SocialIcon"

const NETWORKS = Object.keys(SOCIAL_NETWORK_LABELS) as SocialNetwork[]

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

interface Props {
  value: SocialNetwork
  onChange: (v: SocialNetwork) => void
}

export default function NetworkSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div className="relative flex flex-col gap-1" ref={ref}>
      <label className="text-xs font-medium text-gray-500">Red social</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-colors"
      >
        <span className="flex items-center gap-2">
          <SocialIcon network={value} size={18} />
          <span className="font-medium">{SOCIAL_NETWORK_LABELS[value]}</span>
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 w-56 rounded-2xl border border-gray-100 bg-white shadow-lg overflow-hidden">
          {NETWORKS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => { onChange(n); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-violet-50 ${
                n === value ? "bg-violet-50 text-violet-700 font-semibold" : "text-gray-700"
              }`}
            >
              <SocialIcon network={n} size={18} />
              {SOCIAL_NETWORK_LABELS[n]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
