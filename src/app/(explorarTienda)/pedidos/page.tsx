import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { fetchOrders } from '@/app/(explorarTienda)/api/orders.api'
import OrdersClientShell from '@/components/explorarTienda/orders/OrdersClientShell'

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>
}

export default async function PedidosPage({ searchParams }: Props) {
  const { status = 'TODOS', page = '1' } = await searchParams
  const session = await getServerSession(authOptions)

  if (!session?.user?.backendToken) {
    redirect('/signin?callbackUrl=/pedidos')
  }

  const result = await fetchOrders(session.user.backendToken, status, Number(page))

  return (
    <main className="min-h-screen bg-gray-50 pt-4 md:pt-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8 pb-28 md:pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {result.total} pedido{result.total !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <OrdersClientShell
          initialData={result}
          initialStatus={status}
          token={session.user.backendToken}
        />
      </div>
    </main>
  )
}
