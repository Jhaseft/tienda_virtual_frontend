"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Package, Tag, Layers, Palette, Edit3, Store,
  CheckCircle2, XCircle, Eye, EyeOff, ImagePlus, Trash2, AlertTriangle, Loader2 as Spin,
} from "lucide-react"
import { useSession } from "next-auth/react"
import AdminShell from "@/components/admin/home/AdminShell"
import ProductImageCarousel from "@/components/explorarTienda/product/ProductImageCarousel"
import LoadingState from "@/components/admin/home/LoadingState"
import ProductEditForm from "@/components/admin/products/ProductEditForm"
import ProductPhotoManager from "@/components/admin/products/ProductPhotoManager"
import { getAdminProductById, deleteProduct } from "@/lib/api/admin"

type AdminProduct = Awaited<ReturnType<typeof getAdminProductById>>
interface Category { id: string; name: string }

export default function AdminProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session } = useSession()
  const token = session?.user.backendToken

  const [product, setProduct] = useState<AdminProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showPhotos, setShowPhotos] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (!id || !token) return
    getAdminProductById(id, { token })
      .then((p) => setProduct(p))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id, token])

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
    fetch(`${base}/explorar/categorias`)
      .then((r) => r.json())
      .then((data: Category[]) => setCategories(data))
      .catch(() => {})
  }, [])

  if (loading) return <AdminShell title="Detalle de producto"><LoadingState text="Cargando producto..." /></AdminShell>

  if (notFound || !product) return (
    <AdminShell title="Detalle de producto">
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
        <Package size={48} strokeWidth={1.2} />
        <p className="text-sm font-medium">Producto no encontrado</p>
        <Link href="/products" className="text-violet-600 text-sm font-semibold hover:underline">Volver al listado</Link>
      </div>
    </AdminShell>
  )

  return (
    <AdminShell
      title={editing ? "Editando producto" : product.name}
      subtitle={editing ? "Modifica los datos del producto" : (product.category?.name ?? "Producto")}
    >
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-sm flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center">
              <AlertTriangle size={26} className="text-rose-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">¿Eliminar producto?</h3>
              <p className="text-sm text-gray-400 mt-1">
                Se eliminará <span className="font-semibold text-gray-700">&ldquo;{product.name}&rdquo;</span> permanentemente. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!token) return
                  setDeleting(true)
                  try {
                    await deleteProduct(product.id, { token })
                    router.push("/products")
                  } catch { setDeleting(false) }
                }}
                disabled={deleting}
                className="flex-1 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting ? <><Spin size={15} className="animate-spin" /> Eliminando...</> : <><Trash2 size={15} /> Eliminar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="w-9 h-9 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h1 className="text-base font-bold text-gray-900">{editing ? "Editando producto" : "Volver"}</h1>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="group flex items-center gap-2 text-sm font-semibold text-rose-500 bg-white hover:bg-rose-500 hover:text-white border border-rose-200 hover:border-rose-500 px-4 py-2 rounded-xl shadow-sm transition-all duration-200 active:scale-95"
        >
          <Trash2 size={14} strokeWidth={2.5} />
          <span>Eliminar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">

        <div>
          <ProductImageCarousel photos={product.photos} productName={product.name} />

          {/* Badge visibilidad */}
          <div className="mt-3 flex items-center gap-2">
            {product.isVisible ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Eye size={12} /> Publicado en la tienda
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                <EyeOff size={12} /> No publicado
              </span>
            )}
          </div>

          {(editing || showPhotos) && token && (
            <ProductPhotoManager
              productId={product.id}
              token={token}
              photos={product.photos}
              onChange={(newPhotos) => setProduct((prev) => prev ? { ...prev, photos: newPhotos } : prev)}
            />
          )}
        </div>

        {/* Derecha: vista o edición */}
        {editing ? (
          <ProductEditForm
            product={{
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              stock: product.stock,
              isVisible: product.isVisible,
              isAvailable: product.isAvailable,
              categoryId: product.category?.id ?? null,
              sizes: product.sizes,
              colors: product.colors,
            }}
            token={token!}
            categories={categories}
            onSaved={(updated) => {
              setProduct((prev) => {
                if (!prev) return prev
                return {
                  ...prev,
                  name: updated.name,
                  description: updated.description,
                  price: updated.price,
                  stock: updated.stock,
                  isVisible: updated.isVisible,
                  isAvailable: updated.isAvailable,
                  category: categories.find((c) => c.id === updated.categoryId) ?? null,
                  sizes: updated.sizes.map((s) => ({ ...s, stock: 0 })),
                  colors: updated.colors.map((c) => ({ ...c, stock: 0 })),
                }
              })
              setEditing(false)
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="flex flex-col gap-5">

            <div>
              {product.category && (
                <span className="inline-flex items-center gap-1.5 text-xs text-violet-600 font-semibold uppercase tracking-widest mb-1">
                  <Tag size={11} /> {product.category.name}
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-bold text-violet-600">Bs {product.price.toFixed(2)}</span>
              {product.isAvailable ? (
                <span className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={13} /> Disponible
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-red-50 text-red-500">
                  <XCircle size={13} /> Agotado
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Layers size={15} className="text-gray-400" />
              Stock: <span className="font-semibold text-gray-700">{product.stock} unidades</span>
            </div>

            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-violet-50 shrink-0">
                {product.store.logoUrl ? (
                  <Image src={product.store.logoUrl} alt={product.store.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Store size={18} className="text-violet-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{product.store.name}</p>
                {product.store.city && <p className="text-xs text-gray-400 truncate">{product.store.city}</p>}
              </div>
            </div>

            {product.sizes.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <Layers size={12} /> Opciones disponibles
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <span key={s.id} className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm">
                      {s.size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <Palette size={12} /> Colores
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <span key={c.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm">
                      {c.hexCode && (
                        <span className="w-3.5 h-3.5 rounded-full border border-gray-200 shrink-0" style={{ backgroundColor: c.hexCode }} />
                      )}
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowPhotos((v) => !v); setEditing(false) }}
                className={`flex items-center justify-center gap-2 flex-1 rounded-2xl border font-semibold py-3.5 text-sm transition-all ${
                  showPhotos
                    ? "bg-violet-50 border-violet-300 text-violet-700"
                    : "bg-white border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-600"
                }`}
              >
                <ImagePlus size={16} />
                {showPhotos ? "Ocultar fotos" : "Agregar imágenes"}
              </button>
              <button
                onClick={() => { setEditing(true); setShowPhotos(false) }}
                className="flex items-center justify-center gap-2 flex-1 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold py-3.5 text-sm transition-all shadow-lg shadow-violet-200"
              >
                <Edit3 size={16} /> Editar producto
              </button>
            </div>

          </div>
        )}
      </div>
    </AdminShell>
  )
}
