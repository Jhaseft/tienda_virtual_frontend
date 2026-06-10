'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Store, ChevronRight } from 'lucide-react'
import type { CartGroup } from '@/app/(explorarTienda)/api/carrito.api'
import CartItemRow from './CartItemRow'

interface Props {
  group: CartGroup
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
  loading: boolean
}

export default function CartStoreGroup({ group, onQuantityChange, onRemove, loading }: Props) {
  const router = useRouter()
  const totalUnits = group.items.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">

      {/* Cabecera tienda */}
      <Link
        href={`/tiendas/${group.store.id}`}
        className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
      >
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 ring-2 ring-gray-200 group-hover:ring-violet-300 transition">
          {group.store.logoUrl ? (
            <Image src={group.store.logoUrl} alt={group.store.name} fill className="object-cover" sizes="40px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors truncate">
            {group.store.name}
          </p>
          <p className="text-xs text-gray-400">{group.items.length} {group.items.length === 1 ? 'producto' : 'productos'} · {totalUnits} {totalUnits === 1 ? 'unidad' : 'unidades'}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-400 transition-colors shrink-0" />
      </Link>

      <div className="px-5 divide-y divide-gray-50">
        {group.items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
            loading={loading}
          />
        ))}
      </div>

      <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Subtotal de esta tienda</p>
          <p className="text-xl font-bold text-gray-900">Bs. {group.subtotal.toFixed(2)}</p>
        </div>
        <button
          onClick={() => router.push(`/checkout?storeId=${group.store.id}`)}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm"
        >
          ¡Cómpralo ahora!
        </button>
      </div>
    </div>
  )
}
