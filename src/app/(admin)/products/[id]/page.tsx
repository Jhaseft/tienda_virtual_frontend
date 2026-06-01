"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Package, Tag, Layers, Palette, Edit3, Store,
  CheckCircle2, XCircle, 
} from "lucide-react"
import AdminShell from "@/components/admin/home/AdminShell"
import ProductImageCarousel from "@/components/explorarTienda/product/ProductImageCarousel"
import LoadingState from "@/components/admin/home/LoadingState"
import { fetchProductById } from "@/app/(explorarTienda)/api/public-explorarTienda.api"
import type { ProductDetail } from "@/types/explorar"

export default function AdminProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchProductById(id)
      .then((p) => {
        if (!p) setNotFound(true)
        else setProduct(p)
      })
      .finally(() => setLoading(false))
  }, [id])

  const stockLabel = product
    ? product.sizes.length > 0
      ? `${product.sizes.reduce((s, x) => s + x.stock, 0)} unidades`
      : `${product.stock} unidades`
    : ""


  return (
    <AdminShell
      title={product?.name ?? "Detalle de producto"}
      subtitle={product?.category?.name ?? "Producto"}

    >

      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/products"
          className="w-9 h-9 text-black rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <BackIcon />
        </Link>

        <h1 className="text-xl font-bold text-gray-900">Volver</h1>

      </div>

      {loading && <LoadingState text="Cargando producto..." />}

      {!loading && notFound && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Package size={48} strokeWidth={1.2} />
          <p className="text-sm font-medium">Producto no encontrado</p>
          <Link href="/products" className="text-violet-600 text-sm font-semibold hover:underline">
            Volver al listado
          </Link>
        </div>
      )}

      {!loading && product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">

          <div>
            <ProductImageCarousel photos={product.photos} productName={product.name} />
          </div>

          <div className="flex flex-col gap-5">

            <div>
              {product.category && (
                <span className="inline-flex items-center gap-1.5 text-xs text-violet-600 font-semibold uppercase tracking-widest mb-1">
                  <Tag size={11} />
                  {product.category.name}
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-bold text-violet-600">
                Bs {product.price.toFixed(2)}
              </span>
              {product.isAvailable ? (
                <span className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={13} />
                  Disponible
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-red-50 text-red-500">
                  <XCircle size={13} />
                  Agotado
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Layers size={15} className="text-gray-400" />
              Stock: <span className="font-semibold text-gray-700">{stockLabel}</span>
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
                {product.store.city && (
                  <p className="text-xs text-gray-400 truncate">{product.store.city}</p>
                )}
              </div>
            </div>

            {product.sizes.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <Layers size={12} />
                  Opciones disponibles
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <span
                      key={s.id}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm"
                    >
                      {s.size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <Palette size={12} />
                  Colores
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <span
                      key={c.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm"
                    >
                      {c.hexCode && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-200 shrink-0"
                          style={{ backgroundColor: c.hexCode }}
                        />
                      )}
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href={`/products/${product.id}/edit`}
              className="flex items-center justify-center gap-2 w-full rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold py-3.5 text-sm transition-all shadow-lg shadow-violet-200"
            >
              <Edit3 size={16} />
              Editar producto
            </Link>

          </div>
        </div>
      )}
    </AdminShell>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}