import type { AdminOrder } from "@/types/admin"
import PaymentSection from "./orderDetailInfo/PaymentSection"
import AddressSection from "./orderDetailInfo/AddressSection"
import ShippingSection from "./orderDetailInfo/ShippingSection"

interface Props {
  order: AdminOrder
}

export default function OrderDetailInfo({ order }: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <PaymentSection paymentMethod={order.paymentMethod} />
      {order.address && (
        <AddressSection
          address={order.address}
          orderSeq={order.orderSeq}
          items={order.items}
          total={order.total}
        />
      )}
      <ShippingSection
        shippingZone={order.shippingZone}
        pickupMethod={order.pickupMethod}
        paymentMethod={order.paymentMethod}
      />
    </div>
  )
}
