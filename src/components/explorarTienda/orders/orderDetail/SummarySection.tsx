interface Props {
  subtotal: number
  shippingCost: number
  total: number
}

export default function SummarySection({ subtotal, shippingCost, total }: Props) {
  return (
    <div className="px-6 py-4 border-t border-gray-100">
      <h2 className="text-[16px] font-bold text-gray-800 mb-3">Resumen del pago</h2>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-700">Bs {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Costo de envío</span>
          <span className="font-medium text-gray-700">
            {shippingCost === 0 ? 'Gratis' : `Bs ${shippingCost.toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-600">Precio Total</span>
          <span className="text-lg font-bold text-violet-600">Bs {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
