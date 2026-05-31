"use client"

import { useState } from "react"
import { ProductColor } from "@/types/explorar"

interface Props {
  colors: ProductColor[]
  onSelect?: (color: ProductColor | null) => void
}

export default function ProductColorSelector({ colors, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  if (colors.length === 0) return null

  function handleSelect(color: ProductColor) {
    if (color.stock === 0) return
    const newVal = selected === color.id ? null : color.id
    setSelected(newVal)
    onSelect?.(newVal ? color : null)
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-900 mb-3">Colores</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map(color => {
          const isSelected = selected === color.id
          const isOut = color.stock === 0
          return (
            <button
              key={color.id}
              onClick={() => handleSelect(color)}
              disabled={isOut}
              title={isOut ? `${color.name} - Agotado` : color.name}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                isOut
                  ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                  : isSelected
                  ? "border-violet-600 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-violet-300"
              }`}
            >
              {color.hexCode && (
                <span
                  className="w-4 h-4 rounded-full border border-gray-200 shrink-0"
                  style={{ backgroundColor: color.hexCode }}
                />
              )}
              {color.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
