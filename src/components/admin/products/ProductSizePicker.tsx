"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"

interface Props {
  selected: string[]
  onChange: (sizes: string[]) => void
}

export default function ProductSizePicker({ selected, onChange }: Props) {
  const [custom, setCustom] = useState("")


  function toggle(size: string) {
    onChange(
      selected.includes(size)
        ? selected.filter((s) => s !== size)
        : [...selected, size]
    )
  }

  function addCustom() {
    const v = custom.trim().toUpperCase()
    if (v && !selected.includes(v)) onChange([...selected, v])
    setCustom("")
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-black uppercase tracking-wider">
          Variantes
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          <span className="sm:hidden">Ej: S, M, XL · pequeño, grande · 250g, 500g</span>
          <span className="hidden sm:inline">Ej: tallas (S, M, XL), presentaciones (250g, 500g)</span>
        </p>
      </div>

      {/* Talla personalizada */}
      <div className="flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
          placeholder="Agregar tu variante..."
          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
        />
        <button
          type="button"
          onClick={addCustom}
          className="px-3 py-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition"
        >
          <Plus size={16} />
        </button>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selected.map((s) => (
            <span
              key={s}
              className="flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              {s}
              <button
                type="button"
                onClick={() => toggle(s)}
                className="w-4 h-4 rounded-full bg-violet-300 hover:bg-rose-400 flex items-center justify-center transition-colors shrink-0"
              >
                <X size={10} className="text-white" strokeWidth={3} />
              </button>
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
