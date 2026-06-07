"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { followStore, unfollowStore, checkIsFollowing } from "@/app/(explorarTienda)/api/public-explorarTienda.api"
import { useStorefront } from "@/contexts/StorefrontContext"

interface Props {
  storeId: string
  whatsapp: string | null
  onFollowChange?: (following: boolean) => void
}

export default function StoreActions({ storeId, whatsapp, onFollowChange }: Props) {
  const { data: session } = useSession()
  const { isSubdomain, mainDomainStoreUrl } = useStorefront()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isSubdomain) return
    if (!session?.user?.backendToken) return
    checkIsFollowing(storeId, session.user.backendToken).then(setFollowing)
  }, [storeId, session?.user?.backendToken, isSubdomain])

  async function handleFollow() {
    if (isSubdomain) {
      if (mainDomainStoreUrl) window.location.assign(mainDomainStoreUrl)
      return
    }
    if (!session?.user?.backendToken) return
    setLoading(true)
    try {
      if (following) {
        await unfollowStore(storeId, session.user.backendToken)
        setFollowing(false)
        onFollowChange?.(false)
      } else {
        await followStore(storeId, session.user.backendToken)
        setFollowing(true)
        onFollowChange?.(true)
      }
    } finally {
      setLoading(false)
    }
  }

  function handleContact() {
    if (!whatsapp) return
    const number = whatsapp.replace(/\D/g, "")
    window.open(`https://wa.me/${number}`, "_blank")
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleContact}
        disabled={!whatsapp}
        className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-sm font-semibold py-3 rounded-2xl transition-colors"
      >
        <WhatsAppIcon />
        Contactar
      </button>
      <button
        onClick={handleFollow}
        disabled={loading || (!isSubdomain && !session)}
        className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-2xl border-2 transition-colors disabled:opacity-40 ${
          following
            ? "border-violet-600 bg-violet-50 text-violet-600"
            : "border-gray-200 bg-white text-gray-700 hover:border-violet-300 hover:text-violet-600"
        }`}
      >
        <HeartIcon filled={following} />
        {following ? "Siguiendo" : "Seguir"}
      </button>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.564 4.14 1.541 5.874L.057 23.428a.5.5 0 0 0 .606.614l5.701-1.493A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 0 1-5.015-1.377l-.36-.214-3.733.977.999-3.635-.235-.374A9.778 9.778 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} aria-hidden="true">
      <path d="M12 21C12 21 3 14.5 3 8.5a4.5 4.5 0 0 1 9-.5 4.5 4.5 0 0 1 9 .5C21 14.5 12 21 12 21z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}
