import { notFound } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import {
  fetchStoreById,
  fetchStoreIdBySubdomain,
  fetchStoreProducts,
} from "@/app/(explorarTienda)/api/public-explorarTienda.api"
import StoreProductCard from "@/components/explorarTienda/store/StoreProductCard"
import ProductsSearchInput from "@/components/explorarTienda/store/ProductsSearchInput"

const LIMIT = 12

interface Props {
  params: Promise<{ sub: string }>
  searchParams: Promise<{ page?: string; q?: string }>
}

export default async function StorefrontProductsPage({ params, searchParams }: Props) {
  const { sub } = await params
  const { page = "1", q = "" } = await searchParams
  const currentPage = Math.max(1, Number(page))

  const storeId = await fetchStoreIdBySubdomain(sub)
  if (!storeId) notFound()

  const [store, productsRes] = await Promise.all([
    fetchStoreById(storeId),
    fetchStoreProducts(storeId, currentPage, LIMIT, q),
  ])

  if (!store) notFound()

  const { data: products, total, totalPages } = productsRes

  const pageHref = (p: number) => {
    const qs = new URLSearchParams()
    qs.set("page", String(p))
    if (q) qs.set("q", q)
    return `/productos?${qs.toString()}`
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-4 md:pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 pb-28 md:pb-12">

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Link
            href="/"
            className="w-9 h-9 text-black rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          >
            <BackIcon />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">
              Productos <span className="text-gray-400 font-normal text-base">({total})</span>
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-500 text-sm font-medium rounded-full">
                {store.name}
              </span>
            </h1>
          </div>
          <Suspense>
            <ProductsSearchInput storeId={storeId} initialValue={q} />
          </Suspense>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
            {products.map(product => (
              <StoreProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 gap-2 text-gray-400">
            <p className="text-sm font-medium">
              {q ? `Sin resultados para "${q}"` : "No hay productos disponibles"}
            </p>
            {q && (
              <Link href="/productos" className="text-xs text-violet-600 hover:underline">
                Ver todos los productos
              </Link>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {currentPage > 1 ? (
              <Link
                href={pageHref(currentPage - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-violet-300 hover:text-violet-600 transition-colors"
              >
                <BackIcon />
                Anterior
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border border-gray-100 text-gray-300 text-sm font-medium rounded-xl cursor-not-allowed">
                <BackIcon />
                Anterior
              </span>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link
                  key={p}
                  href={pageHref(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                    p === currentPage
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>

            {currentPage < totalPages ? (
              <Link
                href={pageHref(currentPage + 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-violet-300 hover:text-violet-600 transition-colors"
              >
                Siguiente
                <NextIcon />
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border border-gray-100 text-gray-300 text-sm font-medium rounded-xl cursor-not-allowed">
                Siguiente
                <NextIcon />
              </span>
            )}
          </div>
        )}

        {total > 0 && (
          <p className="text-center text-xs text-gray-400 mt-3">
            Mostrando {(currentPage - 1) * LIMIT + 1}–{Math.min(currentPage * LIMIT, total)} de {total} productos
          </p>
        )}

      </div>
    </main>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
