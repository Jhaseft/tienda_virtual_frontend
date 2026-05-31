"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

interface Props {
  storeId: string
  initialValue?: string
}

export default function ProductsSearchInput({ storeId, initialValue = "" }: Props) {
  const router = useRouter()
  const [value, setValue] = useState(initialValue)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMounted = useRef(false)

  useEffect(() => {
    // Ignorar el primer render para no disparar navegación innecesaria
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams()
      params.set("page", "1")
      if (value.trim()) params.set("q", value.trim())
      router.push(`/tiendas/${storeId}/productos?${params.toString()}`)
    }, 400)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [value, storeId, router])

  return (
    <div className="relative w-full max-w-sm">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <SearchIcon />
      </span>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Buscar producto..."
        className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400 transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
