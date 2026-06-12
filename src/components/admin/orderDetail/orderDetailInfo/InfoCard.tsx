import type React from "react"

interface Props {
  icon: React.ReactNode
  iconBg: string
  label: string
  sublabel?: string
  price?: string
}

export default function InfoCard({ icon, iconBg, label, sublabel, price }: Props) {
  return (
    <div className="flex gap-3 px-4 py-3 rounded-2xl border border-violet-200 bg-violet-50">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          {price && (
            <p className={`text-sm font-bold shrink-0 ${price === "Gratis" ? "text-emerald-600" : "text-gray-900"}`}>
              {price}
            </p>
          )}
        </div>
        {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  )
}
