"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, Loader2, Package } from "lucide-react"
import Link from "next/link"
import AdminShell from "@/components/admin/home/AdminShell"
import ProductPhotoUploader, { type PhotoSlot } from "@/components/admin/products/ProductPhotoUploader"
import ProductInfoForm, { type Category } from "@/components/admin/products/ProductInfoForm"
import ProductSizePicker from "@/components/admin/products/ProductSizePicker"
import ProductColorPicker, { type ColorOption } from "@/components/admin/products/ProductColorPicker"
import ProductVisibilityToggle from "@/components/admin/products/ProductVisibilityToggle"
import { createProduct, uploadProductPhoto, setProductOptions } from "@/lib/api/admin"

export default function NewProductPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const token = session?.user.backendToken

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [isVisible, setIsVisible] = useState(true)
  const [photos, setPhotos] = useState<PhotoSlot[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [colors, setColors] = useState<ColorOption[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
    fetch(`${base}/explorar/categorias`)
      .then((r) => r.json())
      .then((data: Category[]) => setCategories(data))
      .catch(() => {})
  }, [])

  function handleInfoChange(field: string, value: string) {
    if (field === "name") setName(value)
    else if (field === "description") setDescription(value)
    else if (field === "price") setPrice(value)
    else if (field === "stock") setStock(value)
    else if (field === "categoryId") setCategoryId(value)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    if (!name.trim()) return setError("El nombre es obligatorio.")
    if (!price || Number(price) <= 0) return setError("El precio debe ser mayor a 0.")
    if (stock === "" || Number(stock) < 0) return setError("El stock no puede ser negativo.")

    setSaving(true)
    setError(null)

    try {
      const product = await createProduct(
        {
          name: name.trim(),
          description: description.trim() || undefined,
          price: Number(price),
          stock: Number(stock),
          categoryId: categoryId || undefined,
          isVisible,
        },
        { token }
      )

      for (const slot of photos.filter((p) => p.file)) {
        try {
          await uploadProductPhoto(slot.file!, product.id, { token })
        } catch (photoErr: unknown) {
          const msg = photoErr instanceof Error ? photoErr.message : String(photoErr)
          const details = (photoErr as { details?: unknown })?.details
          console.error("❌ Error foto:", msg, details)
        }
      }

      if (sizes.length > 0 || colors.length > 0) {
        await setProductOptions(
          product.id,
          {
            sizes: sizes.length > 0 ? sizes.map((s) => ({ size: s })) : undefined,
            colors: colors.length > 0 ? colors.map((c) => ({ name: c.name, hexCode: c.hex })) : undefined,
          },
          { token }
        )
      }

      setShowSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo crear el producto.")
    } finally {
      setSaving(false)
    }
  }

  const isValid = name.trim() !== "" && Number(price) > 0 && stock !== "" && Number(stock) >= 0

  return (
    <AdminShell title="Nuevo producto" subtitle="Completa los datos del producto">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center gap-4 text-center">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping" />
              <div className="absolute inset-1 rounded-full bg-emerald-100" />
              <svg className="relative z-10" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">¡Producto agregado!</h3>
              <p className="text-sm text-gray-400 mt-1">Tu producto fue creado exitosamente</p>
            </div>
            <button
              onClick={() => router.push("/products")}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
            >
              Ver mis productos
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5 pb-10">

        <ProductPhotoUploader photos={photos} onChange={setPhotos} />

        <ProductInfoForm
          name={name}
          description={description}
          price={price}
          stock={stock}
          categoryId={categoryId}
          categories={categories}
          onChange={handleInfoChange}
        />

        <ProductSizePicker selected={sizes} onChange={setSizes} />

        <ProductColorPicker selected={colors} onChange={setColors} />

        <ProductVisibilityToggle value={isVisible} onChange={setIsVisible} />

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            <ArrowLeft size={15} />
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving || !isValid}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold py-3 text-sm transition-all shadow-lg shadow-violet-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Guardando...</>
            ) : (
              <><Package size={16} /> Guardar producto</>
            )}
          </button>
        </div>

      </form>
    </AdminShell>
  )
}
