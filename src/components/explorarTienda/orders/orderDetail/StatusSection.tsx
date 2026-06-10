import type { OrderStatus } from '@/types/orders'
import { STATUS_CONFIG } from './configs'

interface Props {
  status: OrderStatus
}

export default function StatusSection({ status }: Props) {
  const cfg = STATUS_CONFIG[status]
  return (
    <div className={`px-6 py-4 ${cfg.bg}`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Estado del pedido
      </p>
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
        <span className={`text-base font-bold ${cfg.text}`}>{cfg.label}</span>
      </div>
    </div>
  )
}
