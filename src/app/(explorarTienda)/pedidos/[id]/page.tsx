import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { fetchOrderById } from '@/app/(explorarTienda)/api/orders.api'
import OrderDetailLeft from '@/components/explorarTienda/orders/OrderDetailLeft'
import OrderDetailRight from '@/components/explorarTienda/orders/OrderDetailRight'

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.backendToken) {
    redirect('/signin?callbackUrl=/pedidos')
  }

  const order = await fetchOrderById(id, session.user.backendToken)
  if (!order) notFound()

  return (
    <main className="min-h-screen bg-gray-50 pt-4 md:pt-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8 pb-28 md:pb-12">
        {/* Navegación de regreso */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/pedidos"
            className="w-9 h-9 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <BackIcon />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Pedido #{order.orderSeq}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">{order.store.name}</p>
          </div>
        </div>

        {/* Grid 2 columnas en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6 items-start">
          <OrderDetailLeft order={order} />
          <OrderDetailRight order={order} />
        </div>
      </div>
    </main>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
