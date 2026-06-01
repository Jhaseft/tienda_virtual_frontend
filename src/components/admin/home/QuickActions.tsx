"use client"

import Link from "next/link"
import { PlusCircle, Share2, Store, Check } from "lucide-react"
import { useState } from "react"

interface Props {
  storeId: string
}

const ACTIONS = [
  { label: "Nuevo producto", Icon: PlusCircle, href: "/inventory/new", color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Ver mi tienda",  Icon: Store,      href: "",               color: "text-emerald-600", bg: "bg-emerald-50" },
]

export default function QuickActions({ storeId }: Props) {
  const [copied, setCopied] = useState(false)

  function handleShare() {
    const url = `${window.location.origin}/tiendas/${storeId}`
    if (navigator.share) {
      navigator.share({ title: "Mi tienda", url })
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  return (
    <div className="flex flex-col gap-2 mt-2">
      <p className="text-sm font-bold text-gray-800 mb-1">Acciones rápidas</p>

      {ACTIONS.map(({ label, Icon, href, color, bg }) => (
        <Link
          key={label}
          href={href || `/tiendas/${storeId}`}
          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
        >
          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
            <Icon size={18} className={color} strokeWidth={2} />
          </div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </Link>
      ))}

      <button
        onClick={handleShare}
        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-left"
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${copied ? "bg-emerald-50" : "bg-sky-50"}`}>
          {copied
            ? <Check size={18} className="text-emerald-600" strokeWidth={2.5} />
            : <Share2 size={18} className="text-sky-600" strokeWidth={2} />}
        </div>
        <span className={`text-sm font-medium transition-colors ${copied ? "text-emerald-600" : "text-gray-700"}`}>
          {copied ? "¡Enlace copiado!" : "Compartir mi tienda"}
        </span>
      </button>
    </div>
  )
}
