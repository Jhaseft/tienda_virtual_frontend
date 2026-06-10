import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { fetchOrderById } from '@/app/(explorarTienda)/api/orders.api'
import OrderDetailLeft from '@/components/explorarTienda/orders/OrderDetailLeft'
import OrderDetailRight from '@/components/explorarTienda/orders/OrderDetailRight'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ nuevo?: string }>
}

export default async function OrderDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { nuevo } = await searchParams
  const isNew = nuevo === '1'
  const session = await getServerSession(authOptions)

  if (!session?.user?.backendToken) {
    redirect('/signin?callbackUrl=/pedidos')
  }

  const order = await fetchOrderById(id, session.user.backendToken)
  if (!order) notFound()

  return (
    <main className="min-h-screen bg-gray-50 pt-1 md:pt-15">
      <div className="max-w-6xl mx-auto px-2 lg:px-6 py-4 md:py-8 pb-28 md:pb-12">
        {isNew && (
          <div className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-green-800">¡Pedido realizado con éxito!</p>
              <p className="text-sm text-green-600 mt-0.5">
                El vendedor revisará tu pedido y comprobante. Te notificaremos cuando lo confirme.
              </p>
            </div>
          </div>
        )}

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

        <div className="grid grid-cols-1 md:grid-cols-[1fr_480px] gap-6 items-start">
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
