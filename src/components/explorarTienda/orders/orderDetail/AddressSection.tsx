interface Props {
  address: {
    fullName: string
    street: string
    city: string
    state: string
    phone: string
  }
}

export default function AddressSection({ address }: Props) {
  return (
    <div className="px-6 py-4 border-t border-gray-100">
      <h2 className="text-[16px] font-bold text-gray-800 mb-2">Enviar a</h2>
      <p className="text-sm font-semibold text-gray-900 mb-1">{address.fullName}</p>
      <div className="space-y-0.5">
        <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Calle</span> · {address.street}</p>
        <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Ciudad</span> · {address.city}</p>
        <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Dpto.</span> · {address.state}</p>
        <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Tel</span> · {address.phone}</p>
      </div>
    </div>
  )
}
