'use client'

import Image from 'next/image'
import type { CartItemData } from '@/app/(explorarTienda)/api/carrito.api'

interface Props {
  item: CartItemData
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
  loading: boolean
}

export default function CartItemRow({ item, onQuantityChange, onRemove, loading }: Props) {
  const photo = item.product.photos[0]?.url
  const lineTotal = (item.product.price * item.quantity).toFixed(2)
  const outOfStock = item.product.stock === 0
  const zeroQty = item.quantity === 0 && !outOfStock

  return (
    <div className="flex gap-4 py-5 last:pb-0">
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
        {photo ? (
          <Image src={photo} alt={item.product.name} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 leading-snug line-clamp-2">{item.product.name}</p>

        {item.variant && <p className="text-xs text-gray-400 mt-0.5">Variante: {item.variant}</p>}
        {item.colorName && <p className="text-xs text-gray-400">Color: {item.colorName}</p>}

        <p className="text-sm text-blue-700 font-semibold mt-1">Bs. {item.product.price.toFixed(2)}</p>

        {outOfStock && (
          <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
            <span>⚠</span> Stock agotado — este producto no puede procesarse
          </p>
        )}
        {zeroQty && (
          <p className="text-xs text-amber-500 font-medium mt-1.5">Aumenta la cantidad para continuar</p>
        )}

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={loading || item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition text-base font-medium"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold text-gray-800 border-x border-gray-200">
              {item.quantity}
            </span>
            <button
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={loading || item.quantity >= item.product.stock}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition text-base font-medium"
            >
              +
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            disabled={loading}
            className="text-sm text-gray-400 hover:text-red-500 hover:underline transition disabled:opacity-40"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between shrink-0 py-0.5">
        <p className="text-base font-bold text-gray-900">Bs. {lineTotal}</p>
        <p className="text-sm text-gray-400">{item.quantity} {item.quantity === 1 ? 'unidad' : 'unidades'}</p>
      </div>
    </div>
  )
}
