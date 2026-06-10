'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Store, Check, X, Loader2 } from 'lucide-react'
import type { CartGroup, CartItemData } from '@/app/(explorarTienda)/api/carrito.api'
import { updateCartItem } from '@/app/(explorarTienda)/api/carrito.api'
import { fetchProductById } from '@/app/(explorarTienda)/api/public-explorarTienda.api'
import type { ProductDetail } from '@/types/explorar'

interface Props {
  group: CartGroup
  note: string
  token: string
  onNoteChange: (v: string) => void
  onGroupChange: (updated: CartGroup) => void
  readOnly?: boolean
}

function ReviewItemRow({ item, token, onUpdated, readOnly }: {
  item: CartItemData
  token: string
  onUpdated: (updated: CartItemData) => void
  readOnly?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [detail, setDetail] = useState<ProductDetail | null>(null)

  const [selectedSize, setSelectedSize] = useState<string>(item.variant ?? '')
  const [selectedColor, setSelectedColor] = useState<string>(item.colorName ?? '')
  const [quantity, setQuantity] = useState(item.quantity)

  const photo = item.product.photos[0]?.url

  const handleOpenEdit = async () => {
    setEditing(true)
    if (detail) return
    setLoading(true)
    const d = await fetchProductById(item.product.id)
    setDetail(d)
    setLoading(false)
  }

  const handleCancel = () => {
    setEditing(false)
    setSelectedSize(item.variant ?? '')
    setSelectedColor(item.colorName ?? '')
    setQuantity(item.quantity)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (!readOnly) {
        await updateCartItem(token, item.id, quantity)
      }
      onUpdated({
        ...item,
        quantity,
        variant: selectedSize || null,
        colorName: selectedColor || null,
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const maxQty = detail?.stock ?? item.product.stock

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
          {photo
            ? <Image src={photo} alt={item.product.name} fill className="object-cover" sizes="64px" />
            : <div className="w-full h-full bg-gray-200" />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.name}</p>

          {!editing ? (
            <div className="mt-0.5 space-y-0.5">
              {item.variant && <p className="text-xs text-gray-400">Variante: {item.variant}</p>}
              {item.colorName && <p className="text-xs text-gray-400">Color: {item.colorName}</p>}
              <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {loading && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Loader2 className="w-3 h-3 animate-spin" /> Cargando opciones...
                </div>
              )}

              {/* Variantes (sizes) */}
              {detail && detail.sizes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1.5">Opciones disponibles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.sizes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSize(selectedSize === s.size ? '' : s.size)}
                        className={`text-xs px-3 py-1.5 rounded-xl border-2 font-semibold transition-all ${
                          selectedSize === s.size
                            ? 'border-violet-600 bg-violet-600 text-white'
                            : 'border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-600'
                        }`}
                      >
                        {s.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colores */}
              {detail && detail.colors.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1.5">Colores</p>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.colors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(selectedColor === c.name ? '' : c.name)}
                        title={c.name}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border-2 font-medium transition-all ${
                          selectedColor === c.name
                            ? 'border-violet-600 bg-violet-50 text-violet-700'
                            : 'border-gray-200 text-gray-700 hover:border-violet-300'
                        }`}
                      >
                        {c.hexCode && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-gray-200 shrink-0"
                            style={{ backgroundColor: c.hexCode }}
                          />
                        )}
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Cantidad <span className="text-gray-400 font-normal">· máx. {maxQty} unidades</span>
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-100 rounded-full p-0.5">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-base font-bold"
                    >−</button>
                    <span className="w-10 text-center text-sm font-bold text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                      disabled={quantity >= maxQty}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-base font-bold"
                    >+</button>
                  </div>
                  <span className="text-xs text-gray-400">{quantity === 1 ? '1 unidad' : `${quantity} unidades`}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 border border-gray-300 text-gray-500 text-xs px-4 py-1.5 rounded-full hover:bg-gray-50 transition"
                >
                  <X className="w-3 h-3" /> Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end justify-between shrink-0">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">Bs. {(item.product.price * quantity).toFixed(2)}</p>
            <p className="text-xs text-gray-400">Bs. {item.product.price.toFixed(2)} c/u</p>
          </div>
          {!editing && (
            <button
              onClick={handleOpenEdit}
              className="text-xs text-blue-600 hover:underline hover:text-blue-700 transition mt-2 font-medium"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SectionReview({ group, note, token, onNoteChange, onGroupChange, readOnly = false }: Props) {
  const [items, setItems] = useState(group.items)

  const handleUpdated = (updated: CartItemData) => {
    const next = items.map((i) => (i.id === updated.id ? updated : i))
    setItems(next)
    const subtotal = next.reduce((s, i) => s + i.product.price * i.quantity, 0)
    onGroupChange({ ...group, items: next, subtotal })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
          {group.store.logoUrl
            ? <Image src={group.store.logoUrl} alt={group.store.name} fill className="object-cover" sizes="32px" />
            : <div className="w-full h-full flex items-center justify-center"><Store className="w-4 h-4 text-gray-400" /></div>
          }
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Revisar pedido</h2>
          <p className="text-xs text-gray-400">{group.store.name}</p>
        </div>
      </div>

      <div className="px-6 py-4 divide-y divide-gray-50">
        {items.map((item) => (
          <ReviewItemRow key={item.id} item={item} token={token} onUpdated={handleUpdated} readOnly={readOnly} />
        ))}
      </div>

      <div className="px-6 pb-5">
        <div className="border-t border-gray-100 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nota para el vendedor <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Instrucciones especiales, referencias, etc."
            rows={2}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 resize-none transition"
          />
        </div>
      </div>
    </div>
  )
}
