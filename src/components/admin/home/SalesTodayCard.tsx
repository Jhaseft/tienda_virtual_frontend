import { TrendingUp } from "lucide-react"

interface Props {
  total: number
  count: number
}

export default function SalesTodayCard({ total, count }: Props) {
  return (
    <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm p-5 overflow-hidden">

      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-violet-50" />
      <div className="absolute -bottom-8 -right-2 w-20 h-20 rounded-full bg-violet-50/60" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
              <TrendingUp size={16} className="text-violet-600" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-gray-500">Ventas de hoy</span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-600">
            {count} {count === 1 ? "venta" : "ventas"}
          </span>
        </div>

        <div className="flex items-end gap-1">
          <span className="text-lg font-bold text-gray-400 mb-1">Bs</span>
          <span className="text-4xl font-bold text-gray-900 leading-none">{total.toFixed(2)}</span>
        </div>

        <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-violet-500 to-violet-400 rounded-full"
            style={{ width: count > 0 ? "100%" : "0%" }}
          />
        </div>
      </div>
    </div>
  )
}
