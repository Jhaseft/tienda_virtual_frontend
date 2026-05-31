import Image from 'next/image'
import Link from 'next/link'
import type { OrderListItem, OrderStatus } from '@/types/orders'

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  PENDING:   { label: 'Pendiente',  bg: 'bg-yellow-50',  text: 'text-yellow-600' },
  CONFIRMED: { label: 'Confirmado', bg: 'bg-blue-50',    text: 'text-blue-600' },
  PAID:      { label: 'Pagado',     bg: 'bg-green-50',   text: 'text-green-600' },
  SHIPPED:   { label: 'Enviado',    bg: 'bg-purple-50',  text: 'text-purple-600' },
  DELIVERED: { label: 'Entregado',  bg: 'bg-emerald-50', text: 'text-emerald-700' },
  CANCELLED: { label: 'Cancelado',  bg: 'bg-red-50',     text: 'text-red-500' },
}

interface Props {
  order: OrderListItem
}

export default function OrderCard({ order }: Props) {
  const { label, bg, text } = STATUS_CONFIG[order.status]
  const date = new Date(order.createdAt).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const previewItems = order.items.slice(0, 2)
  const overflow = order.items.length - previewItems.length

  return (
    <Link
      href={`/pedidos/${order.id}`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-100 transition-all px-5 py-4 flex flex-col md:flex-row md:items-center gap-4"
    >
      {/* Tienda */}
      <div className="flex items-center gap-3 md:w-52 shrink-0 min-w-0">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-violet-50 shrink-0">
          {order.store.logoUrl ? (
            <Image
              src={order.store.logoUrl}
              alt={order.store.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <StoreIcon />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{order.store.name}</p>
          {order.store.storeType && (
            <p className="text-xs text-gray-400 truncate">{order.store.storeType}</p>
          )}
        </div>
      </div>

      {/* Número y fecha */}
      <div className="md:w-32 shrink-0">
        <p className="text-sm font-bold text-gray-700">#{order.orderSeq}</p>
        <p className="text-xs text-gray-400 mt-0.5">{date}</p>
      </div>

      {/* Thumbnails de productos */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {previewItems.map((item) => (
          <div
            key={item.id}
            className="relative w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0"
          >
            {item.product.photos[0] ? (
              <Image
                src={item.product.photos[0].url}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImagePlaceholder />
              </div>
            )}
          </div>
        ))}
        {overflow > 0 && (
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-gray-400">+{overflow}</span>
          </div>
        )}
        <p className="text-xs text-gray-400 truncate ml-2 hidden md:block">
          {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Total y estado */}
      <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-1.5 shrink-0">
        <p className="text-base font-bold text-violet-600">
          Bs {order.total.toFixed(2)}
        </p>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${bg} ${text}`}>
          {label}
        </span>
      </div>
    </Link>
  )
}

function StoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        stroke="#7C3AED"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22V12h6v10"
        stroke="#7C3AED"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ImagePlaceholder() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#D1D5DB" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB" />
      <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
