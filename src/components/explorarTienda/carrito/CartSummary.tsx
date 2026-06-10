'use client'

import { useRouter } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import type { CartGroup } from '@/app/(explorarTienda)/api/carrito.api'

interface Props {
  totalItems: number
  totalPrice: number
  groups: CartGroup[]
}

export default function CartSummary({ totalItems, totalPrice, groups }: Props) {
  const router = useRouter()
  const hasMultipleStores = groups.length > 1

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen del pedido</h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Productos ({groups.reduce((s, g) => s + g.items.length, 0)})</span>
          <span>Bs. {totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Envío</span>
          <span className="text-gray-400 italic">Se calcula en el checkout</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3 mb-5">
        <div className="flex justify-between font-bold text-gray-900 text-base">
          <span>Subtotal</span>
          <span>Bs. {totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {hasMultipleStores ? (
        <div className="space-y-2">
          {groups.map((g) => (
            <button
              key={g.store.id}
              onClick={() => router.push(`/checkout?storeId=${g.store.id}`)}
              className="w-full bg-blue-600 text-white py-2.5 rounded-full font-medium hover:bg-blue-700 transition text-sm"
            >
              Pagar solo a {g.store.name}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => router.push(`/checkout?storeId=${groups[0].store.id}`)}
          className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Completar la transacción
        </button>
      )}

      <div className="flex items-start gap-2 mt-4 text-xs text-gray-400">
        <ShieldCheck className="w-4 h-4 flex-shrink-0 text-blue-400 mt-0.5" />
        <span>Tu pago está protegido. El vendedor solo confirma al recibir el comprobante.</span>
      </div>
    </div>
  )
}
