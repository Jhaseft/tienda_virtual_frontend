'use client'

import { useState } from 'react'
import type { FavoritesResponse, FavoriteProduct, FollowedStore } from '@/types/user'
import FavoriteProductCard from './FavoriteProductCard'
import FollowedStoreCard from './FollowedStoreCard'

type Tab = 'products' | 'stores'

interface Props {
  initialData: FavoritesResponse
  token: string
}

export default function FavoritosClientShell({ initialData, token }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('products')
  const [products, setProducts] = useState<FavoriteProduct[]>(initialData.products)
  const [stores, setStores] = useState<FollowedStore[]>(initialData.stores)

  function handleProductRemoved(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  function handleStoreRemoved(id: string) {
    setStores((prev) => prev.filter((s) => s.id !== id))
  }

  const TABS = [
    { key: 'products' as Tab, label: `Productos (${products.length})` },
    { key: 'stores' as Tab, label: `Tiendas (${stores.length})` },
  ]

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-4">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === key ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {label}
            {activeTab === key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {activeTab === 'products' && (
        <div className="flex flex-col gap-3">
          {products.length === 0 ? (
            <EmptyState
              icon={<HeartIcon />}
              title="Sin productos favoritos"
              description="Guarda productos con el corazón para verlos aquí."
            />
          ) : (
            products.map((product) => (
              <FavoriteProductCard
                key={product.id}
                product={product}
                token={token}
                onRemoved={handleProductRemoved}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'stores' && (
        <div className="flex flex-col gap-3">
          {stores.length === 0 ? (
            <EmptyState
              icon={<StoreIcon />}
              title="Sin tiendas seguidas"
              description="Sigue tiendas para verlas aquí y estar al tanto de sus novedades."
            />
          ) : (
            stores.map((store) => (
              <FollowedStoreCard
                key={store.id}
                store={store}
                token={token}
                onRemoved={handleStoreRemoved}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center py-20 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-gray-700 font-semibold text-base">{title}</p>
      <p className="text-gray-400 text-sm text-center max-w-xs">{description}</p>
    </div>
  )
}

function HeartIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21C12 21 3 14.5 3 8.5a4.5 4.5 0 0 1 9-.5 4.5 4.5 0 0 1 9 .5C21 14.5 12 21 12 21z"
        stroke="#7C3AED"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StoreIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
