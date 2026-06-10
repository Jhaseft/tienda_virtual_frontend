import type { PaymentType } from '@/types/explorar'
import ShippingCard from './ShippingCard'
import { PAYMENT_CONFIG } from './configs'

interface Props {
  paymentMethod: PaymentType
}

export default function PaymentSection({ paymentMethod }: Props) {
  const cfg = PAYMENT_CONFIG[paymentMethod]
  return (
    <div className="px-6 py-4 border-t border-gray-100">
      <h2 className="text-[16px] font-bold text-gray-800 mb-3">Método de pago</h2>
      <ShippingCard
        icon={<cfg.Icon className={`w-5 h-5 ${cfg.color}`} />}
        label={cfg.label}
      />
    </div>
  )
}
