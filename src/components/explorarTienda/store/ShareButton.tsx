"use client"

import { useState } from "react"

interface Props {
  storeName: string
}

export default function ShareButton({ storeName }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href

    if (navigator.share) {
      await navigator.share({
        title: storeName,
        text: `Mira esta tienda en MiTienda: ${storeName}`,
        url,
      })
      return
    }

    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      title="Compartir tienda"
      className={`
        relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold
        border transition-all duration-300 overflow-hidden select-none
        ${copied
          ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200"
          : "bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 hover:shadow-md"
        }
      `}
    >
      {copied && (
        <span className="absolute inset-0 animate-ping rounded-2xl bg-violet-400 opacity-20" />
      )}

      <span className={`transition-transform duration-200 ${copied ? "scale-110" : "scale-100"}`}>
        {copied ? <CheckIcon /> : <ShareIcon />}
      </span>

      <span className="hidden sm:block">
        {copied ? "¡Copiado!" : "Compartir"}
      </span>
    </button>
  )
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
