import { TrendingUp } from "lucide-react"

interface Props {
  total: number
  count: number
}

export default function SalesTodayCard({ total, count }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <TrendingUp size={16} className="text-violet-600" strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold text-gray-600">Ventas de hoy</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-600">
          {count} {count === 1 ? "venta" : "ventas"}
        </span>
      </div>

      <div className="flex items-end gap-1.5">
        <span className="text-base font-bold text-gray-400 mb-0.5">Bs</span>
        <span className="text-4xl font-bold text-gray-900 leading-none">{total.toFixed(2)}</span>
      </div>

      <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-500"
          style={{ width: count > 0 ? "100%" : "3%" }}
        />
      </div>
    </div>
  )
}
