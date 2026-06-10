'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
      <p className="text-gray-400 mb-6">Agrega productos desde las tiendas para verlos aquí</p>
      <Link
        href="/tiendas"
        className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition"
      >
        Explorar tiendas
      </Link>
    </div>
  )
}
