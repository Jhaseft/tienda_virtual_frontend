import type { OrderDetail } from '@/types/orders'
import StoreCard from './orderLeft/StoreCard'
import ItemsList from './orderLeft/ItemsList'
import DeliveryAddressCard from './orderLeft/DeliveryAddressCard'
import NotesCard from './orderLeft/NotesCard'

interface Props {
  order: OrderDetail
}

export default function OrderDetailLeft({ order }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <StoreCard store={order.store} whatsappThreadUrl={order.whatsappThreadUrl} />

      <ItemsList items={order.items} />

      {order.deliveryAddress && (
        <DeliveryAddressCard deliveryAddress={order.deliveryAddress} />
      )}

      {order.notes && <NotesCard notes={order.notes} />}
    </div>
  )
}
