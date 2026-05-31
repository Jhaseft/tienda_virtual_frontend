import type { OrderDetail, OrderStatus } from '@/types/orders'
import type { PaymentType } from '@/types/explorar'

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  PENDING:   { label: 'Pendiente',  bg: 'bg-yellow-50',  text: 'text-yellow-700', dot: 'bg-yellow-400' },
  CONFIRMED: { label: 'Confirmado', bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-400' },
  PAID:      { label: 'Pagado',     bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-400' },
  SHIPPED:   { label: 'Enviado',    bg: 'bg-purple-50',  text: 'text-purple-700', dot: 'bg-purple-400' },
  DELIVERED: { label: 'Entregado',  bg: 'bg-emerald-50', text: 'text-emerald-800',dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Cancelado',  bg: 'bg-red-50',     text: 'text-red-600',    dot: 'bg-red-400' },
}

const PAYMENT_LABEL: Record<PaymentType, string> = {
  QR:           'QR Bancario',
  YAPE:         'Yape',
  TIGO_MONEY:   'Tigo Money',
  EFECTIVO:     'Efectivo',
  TRANSFERENCIA:'Transferencia',
}

interface Props {
  order: OrderDetail
}

export default function OrderDetailRight({ order }: Props) {
  const status = STATUS_CONFIG[order.status]
  const dateTime = new Date(order.createdAt).toLocaleString('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="md:sticky md:top-24 flex flex-col gap-4">
      {/* Tarjeta de estado */}
      <div className={`rounded-2xl px-5 py-4 ${status.bg}`}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Estado del pedido
        </p>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${status.dot}`} />
          <span className={`text-base font-bold ${status.text}`}>{status.label}</span>
        </div>
      </div>

      {/* Resumen de pago */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-4">Resumen del pago</h2>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium text-gray-700">
              Bs {order.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Envío</span>
            <span className="font-medium text-gray-700">
              {order.shippingCost === 0 ? 'Gratis' : `Bs ${order.shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="h-px bg-gray-100 my-1" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-violet-600">
              Bs {order.total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Método de pago</p>
          <p className="text-sm font-semibold text-gray-700">
            {PAYMENT_LABEL[order.paymentMethod]}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Fecha y hora</p>
          <p className="text-sm text-gray-600">{dateTime}</p>
        </div>

        {order.voucherUrl && (
          <a
            href={order.voucherUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-violet-200 text-violet-600 text-sm font-semibold hover:bg-violet-50 transition-colors"
          >
            <ReceiptIcon />
            Ver comprobante
          </a>
        )}
      </div>
    </div>
  )
}

function ReceiptIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
