interface Props {
  deliveryAddress: string
}

export default function DeliveryAddressCard({ deliveryAddress }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
      <p className="text-[16px] font-bold text-gray-800 mb-1">Dirección de entrega</p>
      <p className="text-sm text-gray-700">{deliveryAddress}</p>
    </div>
  )
}
