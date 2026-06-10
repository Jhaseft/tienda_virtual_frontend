import type { OrderDetail } from '@/types/orders'
import StatusSection from './orderDetail/StatusSection'
import PaymentSection from './orderDetail/PaymentSection'
import AddressSection from './orderDetail/AddressSection'
import ShippingSection from './orderDetail/ShippingSection'
import SummarySection from './orderDetail/SummarySection'
import DateSection from './orderDetail/DateSection'

interface Props {
  order: OrderDetail
}

export default function OrderDetailRight({ order }: Props) {
  return (
    <div className="md:sticky md:top-24 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <StatusSection status={order.status} />

      <PaymentSection paymentMethod={order.paymentMethod} />

      {order.address && <AddressSection address={order.address} />}

      <ShippingSection
        shippingZone={order.shippingZone}
        pickupMethod={order.pickupMethod}
        paymentMethod={order.paymentMethod}
      />

      <SummarySection
        subtotal={order.subtotal}
        shippingCost={order.shippingCost}
        total={order.total}
      />

      <DateSection createdAt={order.createdAt} />

      {order.voucherUrl && (
        <div className="px-6 pb-5 border-t border-gray-100 pt-4">
          <a
            href={order.voucherUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-violet-200 text-violet-600 text-sm font-semibold hover:bg-violet-50 transition-colors"
          >
            <ReceiptIcon />
            Ver comprobante
          </a>
        </div>
      )}
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
