'use client'

import { useState, useTransition } from 'react'
import { fetchOrders } from '@/app/(explorarTienda)/api/orders.api'
import type { OrderListResponse, OrderStatus } from '@/types/orders'
import OrderCard from './OrderCard'
import OrdersEmptyState from './OrdersEmptyState'

type Tab = 'TODOS' | OrderStatus

const TABS: { key: Tab; label: string }[] = [
  { key: 'TODOS',     label: 'Todos' },
  { key: 'PENDING',   label: 'Pendientes' },
  { key: 'CONFIRMED', label: 'Confirmados' },
  { key: 'PAID',      label: 'Pagados' },
  { key: 'SHIPPED',   label: 'Enviados' },
  { key: 'DELIVERED', label: 'Entregados' },
  { key: 'CANCELLED', label: 'Cancelados' },
]

interface Props {
  initialData: OrderListResponse
  initialStatus: string
  token: string
}

export default function OrdersClientShell({ initialData, initialStatus, token }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(
    (TABS.find((t) => t.key === initialStatus)?.key) ?? 'TODOS',
  )
  const [data, setData] = useState<OrderListResponse>(initialData)
  const [isPending, startTransition] = useTransition()

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    startTransition(async () => {
      const result = await fetchOrders(token, tab === 'TODOS' ? undefined : tab)
      setData(result)
    })
  }

  return (
    <div>
      {/* Barra de tabs */}
      <div className="sticky top-16 z-30 bg-gray-50 pb-2 -mx-6 px-6 md:-mx-12 md:px-12">
        <div className="flex gap-1 overflow-x-auto border-b border-gray-200" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`shrink-0 px-4 py-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
                activeTab === key
                  ? 'text-violet-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {label}
              {activeTab === key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de pedidos */}
      <div
        className={`mt-4 flex flex-col gap-3 transition-opacity duration-150 ${
          isPending ? 'opacity-60 pointer-events-none' : 'opacity-100'
        }`}
      >
        {data.data.length === 0 ? (
          <OrdersEmptyState activeTab={activeTab} />
        ) : (
          data.data.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  )
}
