"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check, Tag } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export interface Category { id: string; name: string }

interface Props {
  name: string
  description: string
  price: string
  stock: string
  categoryId: string
  categories: Category[]
  onChange: (field: string, value: string) => void
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"

export default function ProductInfoForm({
  name, description, price, stock, categoryId, categories, onChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const ref = useRef<HTMLDivElement>(null)

  const selected = categories.find((c) => c.id === categoryId)
  const filtered = query.trim()
    ? categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : categories

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleOpen() {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <p className="text-sm font-bold text-black uppercase tracking-wider">Información</p>

      <div>
        <label className="block text-sm font-semibold text-gray-500 mb-1.5">
          Nombre del producto <span className="text-rose-400">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Ej: Camiseta básica blanca"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-500 mb-1.5">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe el producto..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-500 mb-1.5">
            Precio (Bs) <span className="text-rose-400">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => onChange("price", e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-500 mb-1.5">
            Stock <span className="text-rose-400">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => onChange("stock", e.target.value)}
            placeholder="0"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-500 mb-1.5">Categoría</label>
        <div ref={ref} className="relative">

          {/* trigger */}
          <button
            type="button"
            onClick={handleOpen}
            className={`w-full flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-all ${
              open
                ? "border-violet-400 ring-2 ring-violet-100 bg-white"
                : "border-gray-200 bg-gray-50 hover:border-violet-300"
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
              <Tag size={12} className="text-violet-500" />
            </div>
            <span className={`flex-1 text-left truncate ${selected ? "text-gray-800 font-medium" : "text-gray-400"}`}>
              {selected?.name ?? "Sin categoría"}
            </span>
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} className="text-gray-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute z-20 mt-1.5 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden"
              >
                {/* buscador */}
                <div className="px-3 pt-3 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                    <Tag size={13} className="text-gray-400 shrink-0" />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar categoría..."
                      className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* lista */}
                <ul className="max-h-44 overflow-y-auto">
                  {[{ id: "", name: "Sin categoría" }, ...filtered].map((c) => {
                    const active = categoryId === c.id
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => { onChange("categoryId", c.id); setOpen(false); setQuery("") }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            active ? "bg-violet-50 text-violet-700" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            active ? "bg-violet-100" : "bg-gray-100"
                          }`}>
                            <Tag size={11} className={active ? "text-violet-500" : "text-gray-400"} />
                          </div>
                          <span className={`flex-1 text-left font-medium ${active ? "text-violet-700" : ""}`}>
                            {c.name}
                          </span>
                          {active && <Check size={14} className="text-violet-500 shrink-0" />}
                        </button>
                      </li>
                    )
                  })}
                  {filtered.length === 0 && (
                    <li className="px-4 py-4 text-xs text-gray-400 text-center">Sin resultados</li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
