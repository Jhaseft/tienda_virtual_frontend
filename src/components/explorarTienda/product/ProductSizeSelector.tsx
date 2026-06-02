"use client"

import { useState } from "react"
import { ProductSize } from "@/types/explorar"

interface Props {
  sizes: ProductSize[]
  onSelect?: (size: ProductSize | null) => void
}

export default function ProductSizeSelector({ sizes, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  if (sizes.length === 0) return null

  function handleSelect(size: ProductSize) {
    const newVal = selected === size.id ? null : size.id
    setSelected(newVal)
    onSelect?.(newVal ? size : null)
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-900 mb-3">Opciones disponibles</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map(size => {
          const isSelected = selected === size.id
          return (
            <button
              key={size.id}
              onClick={() => handleSelect(size)}
              className={`min-w-11 px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                isSelected
                  ? "border-violet-600 bg-violet-600 text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-violet-300 hover:text-violet-600"
              }`}
            >
              {size.size}
            </button>
          )
        })}
      </div>
    </div>
  )
}
