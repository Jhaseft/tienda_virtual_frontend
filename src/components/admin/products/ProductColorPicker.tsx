"use client"

import { useState } from "react"
import { Check, Plus, X } from "lucide-react"

export interface ColorOption { name: string; hex: string }

const PRESET_COLORS: ColorOption[] = [
  { name: "Negro",       hex: "#1a1a1a" },
  { name: "Blanco",      hex: "#FFFFFF" },
  { name: "Gris",        hex: "#9ca3af" },
  { name: "Rojo",        hex: "#dc2626" },
  { name: "Azul",        hex: "#2563eb" },
  { name: "Azul marino", hex: "#1e3a5f" },
  { name: "Verde",       hex: "#16a34a" },
  { name: "Amarillo",    hex: "#eab308" },
  { name: "Rosado",      hex: "#f9a8d4" },
  { name: "Beige",       hex: "#d4b896" },
  { name: "Naranja",     hex: "#ea580c" },
  { name: "Morado",      hex: "#7c3aed" },
]

interface Props {
  selected: ColorOption[]
  onChange: (colors: ColorOption[]) => void
}

export default function ProductColorPicker({ selected, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false)
  const [customName, setCustomName] = useState("")
  const [customHex, setCustomHex] = useState("#000000")

  function toggle(color: ColorOption) {
    onChange(
      selected.some((c) => c.name === color.name)
        ? selected.filter((c) => c.name !== color.name)
        : [...selected, color]
    )
  }

  function addCustom() {
    const name = customName.trim()
    if (!name) return
    if (!selected.some((c) => c.name === name)) {
      onChange([...selected, { name, hex: customHex }])
    }
    setCustomName("")
    setCustomHex("#000000")
    setShowPicker(false)
  }

  function remove(name: string) {
    onChange(selected.filter((c) => c.name !== name))
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
      <p className="text-sm font-bold text-black uppercase tracking-wider">
        Colores disponibles
      </p>

      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((c) => {
          const active = selected.some((x) => x.name === c.name)
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => toggle(c)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                active
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-gray-200 shrink-0"
                style={{ backgroundColor: c.hex }}
              />
              {c.name}
              {active && <Check size={11} />}
            </button>
          )
        })}
      </div>

      {/* Color personalizado */}
      {showPicker ? (
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={customHex}
            onChange={(e) => setCustomHex(e.target.value)}
            className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5 bg-white shrink-0"
          />
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
            placeholder="Nombre del color"
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
          />
          <button
            type="button"
            onClick={addCustom}
            className="px-3 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition text-sm font-semibold shrink-0"
          >
            Agregar
          </button>
          <button
            type="button"
            onClick={() => setShowPicker(false)}
            className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 transition"
        >
          <Plus size={13} /> Agregar color personalizado
        </button>
      )}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selected.map((c) => (
            <span
              key={c.name}
              className="flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-violet-300 shrink-0"
                style={{ backgroundColor: c.hex }}
              />
              {c.name}
              <button
                type="button"
                onClick={() => remove(c.name)}
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
