"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface Props {
  storeId: string
  storeName: string
  storeLogoUrl?: string | null
}

export default function ChatStoreButton({ storeId, storeName, storeLogoUrl }: Props) {
  const { data: session } = useSession()
  const router = useRouter()

  function handleClick() {
    const params = new URLSearchParams({ storeId, storeName: storeName })
    if (storeLogoUrl) params.set("storeLogoUrl", storeLogoUrl)
    const url = `/chat?${params.toString()}`
    if (!session?.user?.backendToken) {
      router.push(`/signin?callbackUrl=${encodeURIComponent(url)}`)
      return
    }
    router.push(url)
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 transition-colors shadow-sm"
      title="Escribir a la tienda"
    >
      <ChatIcon />
      <span className="text-sm font-semibold text-white whitespace-nowrap">Enviar mensaje</span>
    </button>
  )
}

function ChatIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white shrink-0">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
