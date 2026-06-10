import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  label: string
  sublabel: string
  price: string
  isSelected: boolean
  onClick: () => void
}

export default function ShippingRow({ icon, label, sublabel, price, isSelected, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex gap-3 px-4 py-3.5 rounded-2xl border cursor-pointer transition-all duration-150 ${
        isSelected
          ? 'border-violet-300 bg-violet-50 shadow-sm'
          : 'border-gray-100 bg-white shadow-sm hover:border-violet-200'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
        isSelected ? 'bg-violet-100' : 'bg-violet-50'
      }`}>
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className={`text-sm font-bold shrink-0 ${price === 'Gratis' ? 'text-emerald-600' : 'text-gray-900'}`}>
            {price}
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>
      </div>
    </div>
  )
}
