import { Banknote } from "lucide-react"
import { PAYMENT_CONFIG } from "./configs"
import InfoCard from "./InfoCard"

interface Props {
  paymentMethod: string
}

export default function PaymentSection({ paymentMethod }: Props) {
  const config = PAYMENT_CONFIG[paymentMethod] ?? {
    label: paymentMethod,
    Icon: Banknote,
    color: "text-gray-600",
    bg: "bg-gray-100",
  }

  return (
    <div className="px-5 py-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Método de pago</p>
      <InfoCard
        icon={<config.Icon className={`w-5 h-5 ${config.color}`} />}
        iconBg={config.bg}
        label={config.label}
      />
    </div>
  )
}
