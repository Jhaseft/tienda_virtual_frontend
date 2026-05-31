'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { removeFavorite } from '@/app/(explorarTienda)/api/public-explorarTienda.api'
import type { FavoriteProduct } from '@/types/user'

interface Props {
  product: FavoriteProduct
  token: string
  onRemoved: (id: string) => void
}

export default function FavoriteProductCard({ product, token, onRemoved }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleRemove(e: React.MouseEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      await removeFavorite(product.id, token)
      onRemoved(product.id)
    } catch {
      // silently ignore — item stays in list
    } finally {
      setLoading(false)
    }
  }

  return (
    <Link
      href={`/productos/${product.id}`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-100 transition-all px-5 py-4 flex items-center gap-4"
    >
      {/* Imagen */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        {product.photos[0] ? (
          <Image
            src={product.photos[0].url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImagePlaceholder />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {product.store.logoUrl && (
            <div className="relative w-4 h-4 rounded-full overflow-hidden bg-violet-50 shrink-0">
              <Image
                src={product.store.logoUrl}
                alt={product.store.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <p className="text-xs text-gray-400 truncate">{product.store.name}</p>
        </div>
      </div>

      {/* Precio y botón corazón */}
      <div className="flex items-center gap-3 shrink-0">
        <p className="text-base font-bold text-violet-600">
          Bs {product.price.toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          disabled={loading}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            loading
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-pink-500 hover:bg-pink-50'
          }`}
          aria-label="Quitar de favoritos"
        >
          <HeartFilledIcon />
        </button>
      </div>
    </Link>
  )
}

function HeartFilledIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21C12 21 3 14.5 3 8.5a4.5 4.5 0 0 1 9-.5 4.5 4.5 0 0 1 9 .5C21 14.5 12 21 12 21z" />
    </svg>
  )
}

function ImagePlaceholder() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#D1D5DB" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB" />
      <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
