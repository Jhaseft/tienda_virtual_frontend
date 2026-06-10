import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { authOptions } from '@/lib/auth'
import { fetchCart } from '@/app/(explorarTienda)/api/carrito.api'
import CartClientShell from '@/components/explorarTienda/carrito/CartClientShell'

export default async function CarritoPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.backendToken) {
    redirect('/signin?callbackUrl=/carrito')
  }

  const groups = await fetchCart(session.user.backendToken)
  const totalItems = groups.reduce((s, g) => s + g.items.length, 0)

  return (
    <main className="min-h-screen bg-gray-50 pt-1 md:pt-15">
      <div className="max-w-6xl mx-auto px-2 lg:px-6 py-4 md:py-8 pb-28 md:pb-12">

        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Carro de compras</h1>
            <p className="text-sm text-gray-400">
              {totalItems === 0
                ? 'Tu carrito está vacío'
                : `${totalItems} ${totalItems === 1 ? 'producto' : 'productos'} en ${groups.length} ${groups.length === 1 ? 'tienda' : 'tiendas'}`}
            </p>
          </div>
        </div>

        <CartClientShell initialGroups={groups} token={session.user.backendToken} />
      </div>
    </main>
  )
}
