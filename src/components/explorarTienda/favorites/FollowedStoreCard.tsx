'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { unfollowStore } from '@/app/(explorarTienda)/api/public-explorarTienda.api'
import type { FollowedStore } from '@/types/user'

interface Props {
  store: FollowedStore
  token: string
  onRemoved: (id: string) => void
}

export default function FollowedStoreCard({ store, token, onRemoved }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleUnfollow(e: React.MouseEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      await unfollowStore(store.id, token)
      onRemoved(store.id)
    } catch {
      // silently ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <Link
      href={`/tiendas/${store.id}`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-100 transition-all px-5 py-4 flex items-center gap-4"
    >
      {/* Logo */}
      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-violet-50 shrink-0">
        {store.logoUrl ? (
          <Image src={store.logoUrl} alt={store.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <StoreIcon />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{store.name}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {store.storeType && (
            <span className="text-xs text-gray-400 truncate">{store.storeType}</span>
          )}
          {store.city && (
            <>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400 truncate">{store.city}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <StarIcon />
          <span className="text-xs font-medium text-gray-600">
            {store.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Botón dejar de seguir */}
      <button
        onClick={handleUnfollow}
        disabled={loading}
        className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
          loading
            ? 'text-gray-300 border-gray-100 cursor-not-allowed'
            : 'text-gray-500 border-gray-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50'
        }`}
      >
        {loading ? '...' : 'Dejar de seguir'}
      </button>
    </Link>
  )
}

function StoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        stroke="#7C3AED"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 22V12h6v10" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
