"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Loader2, Tag, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import ProductSizePicker from "./ProductSizePicker"
import ProductColorPicker, { type ColorOption } from "./ProductColorPicker"
import ProductVisibilityToggle from "./ProductVisibilityToggle"
import { updateProduct, setProductOptions } from "@/lib/api/admin"

interface Category { id: string; name: string }

interface ProductEditData {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  isVisible: boolean
  isAvailable: boolean
  categoryId?: string | null
  sizes: { id: string; size: string }[]
  colors: { id: string; name: string; hexCode: string | null }[]
}

interface Props {
  product: ProductEditData
  token: string
  categories: Category[]
  onSaved: (updated: ProductEditData) => void
  onCancel: () => void
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"

export default function ProductEditForm({ product, token, categories, onSaved, onCancel }: Props) {
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description ?? "")
  const [price, setPrice] = useState(String(product.price))
  const [stock, setStock] = useState(String(product.stock))
  const [categoryId, setCategoryId] = useState(product.categoryId ?? "")
  const [isVisible, setIsVisible] = useState(product.isVisible)
  const [sizes, setSizes] = useState<string[]>(product.sizes.map((s) => s.size))
  const [colors, setColors] = useState<ColorOption[]>(
    product.colors.map((c) => ({ name: c.name, hex: c.hexCode ?? "#000000" }))
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [catOpen, setCatOpen] = useState(false)
  const [catQuery, setCatQuery] = useState("")
  const catRef = useRef<HTMLDivElement>(null)
  const catInputRef = useRef<HTMLInputElement>(null)

  const selectedCat = categories.find((c) => c.id === categoryId)
  const filteredCats = catQuery.trim()
    ? categories.filter((c) => c.name.toLowerCase().includes(catQuery.toLowerCase()))
    : categories

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false); setCatQuery("")
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function handleSave() {
    if (!name.trim()) return setError("El nombre es obligatorio.")
    if (!price || Number(price) <= 0) return setError("El precio debe ser mayor a 0.")

    setSaving(true)
    setError(null)
    try {
      await updateProduct(
        product.id,
        {
          name: name.trim(),
          description: description.trim() || undefined,
          price: Number(price),
          stock: Number(stock),
          categoryId: categoryId || null,
          isVisible,
        },
        { token }
      )

      await setProductOptions(
        product.id,
        {
          sizes: sizes.map((s) => ({ size: s })),
          colors: colors.map((c) => ({ name: c.name, hexCode: c.hex })),
        },
        { token }
      )

      onSaved({
        ...product,
        name: name.trim(),
        description: description.trim() || null,
        price: Number(price),
        stock: Number(stock),
        categoryId: categoryId || null,
        isVisible,
        sizes: sizes.map((s, i) => ({ id: product.sizes[i]?.id ?? s, size: s })),
        colors: colors.map((c, i) => ({ id: product.colors[i]?.id ?? c.name, name: c.name, hexCode: c.hex })),
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nombre</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe el producto..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Precio (Bs)</label>
          <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Stock</label>
          <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Categoría</label>
        <div ref={catRef} className="relative">
          <button
            type="button"
            onClick={() => { setCatOpen((o) => !o); setTimeout(() => catInputRef.current?.focus(), 50) }}
            className={`w-full flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-all ${
              catOpen ? "border-violet-400 ring-2 ring-violet-100 bg-white" : "border-gray-200 bg-gray-50 hover:border-violet-300"
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
              <Tag size={12} className="text-violet-500" />
            </div>
            <span className={`flex-1 text-left truncate ${selectedCat ? "text-gray-800 font-medium" : "text-gray-400"}`}>
              {selectedCat?.name ?? "Sin categoría"}
            </span>
            <motion.div animate={{ rotate: catOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} className="text-gray-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {catOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute z-20 mt-1.5 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="px-3 pt-3 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                    <Tag size={13} className="text-gray-400 shrink-0" />
                    <input
                      ref={catInputRef}
                      value={catQuery}
                      onChange={(e) => setCatQuery(e.target.value)}
                      placeholder="Buscar categoría..."
                      className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <ul className="max-h-44 overflow-y-auto">
                  {[{ id: "", name: "Sin categoría" }, ...filteredCats].map((c) => {
                    const active = categoryId === c.id
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => { setCategoryId(c.id); setCatOpen(false); setCatQuery("") }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            active ? "bg-violet-50 text-violet-700" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-violet-100" : "bg-gray-100"}`}>
                            <Tag size={11} className={active ? "text-violet-500" : "text-gray-400"} />
                          </div>
                          <span className={`flex-1 text-left font-medium ${active ? "text-violet-700" : ""}`}>{c.name}</span>
                          {active && <Check size={14} className="text-violet-500 shrink-0" />}
                        </button>
                      </li>
                    )
                  })}
                  {filteredCats.length === 0 && (
                    <li className="px-4 py-4 text-xs text-gray-400 text-center">Sin resultados</li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ProductSizePicker selected={sizes} onChange={setSizes} />

      <ProductColorPicker selected={colors} onChange={setColors} />

      <ProductVisibilityToggle value={isVisible} onChange={setIsVisible} />

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          <X size={15} /> Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold py-3 text-sm transition-all shadow-lg shadow-violet-200 disabled:opacity-60"
        >
          {saving
            ? <><Loader2 size={16} className="animate-spin" /> Guardando...</>
            : <><Check size={16} /> Guardar cambios</>}
        </button>
      </div>

    </div>
  )
}
