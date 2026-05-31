import { Suspense } from "react"
import { fetchSearch } from "@/app/(explorarTienda)/api/explorarTienda.api"
import SearchBar from "@/components/explorarTienda/home/SearchBar"
import StoreCard from "@/components/explorarTienda/home/StoreCard"
import Image from "next/image"
import Link from "next/link"

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function BuscarPage({ searchParams }: Props) {
  const { q = "", page = "1" } = await searchParams
  const currentPage = Math.max(1, Number(page))
  const results = await fetchSearch(q.trim(), currentPage)
  const totalResults = results.stores.length + results.products.length
  const { productTotal, productTotalPages } = results

  return (
    <main className="min-h-screen bg-gray-50 pt-4 md:pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 pb-28 md:pb-12">
          <div className="flex items-center gap-3 mb-4 md:hidden">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
            >
              <BackIcon />
            </Link>
            <div className="flex-1">
              <Suspense>
                <SearchBar />
              </Suspense>
            </div>
          </div>

          {q.trim() && (
            <p className="text-xs text-gray-500 mb-4">
              {totalResults === 0
                ? `Sin resultados para "${q}"`
                : `${totalResults} resultado${totalResults !== 1 ? "s" : ""} para "${q}"`}
            </p>
          )}

          {results.stores.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold text-gray-700 mb-3">Tiendas</h2>
              <div className="flex flex-col gap-3">
                {results.stores.map(store => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            </section>
          )}

          {results.products.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold text-gray-700 mb-3">
                Productos
                {productTotal > 0 && <span className="ml-1.5 text-gray-400 font-normal">({productTotal})</span>}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {results.products.map(product => (
                  <Link
                    key={product.id}
                    href={`/productos/${product.id}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="w-full aspect-square bg-gray-100 relative">
                      {product.photos[0] ? (
                        <Image
                          src={product.photos[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImagePlaceholder />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 truncate">{product.store.name}</p>
                      <p className="text-sm font-bold text-violet-600 mt-1">
                        Bs {product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {productTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {currentPage > 1 ? (
                    <Link href={`/buscar?q=${encodeURIComponent(q)}&page=${currentPage - 1}`}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-violet-300 hover:text-violet-600 transition-colors">
                      <BackIcon /> Anterior
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border border-gray-100 text-gray-300 text-sm font-medium rounded-xl cursor-not-allowed">
                      <BackIcon /> Anterior
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: productTotalPages }, (_, i) => i + 1).map(p => (
                      <Link key={p} href={`/buscar?q=${encodeURIComponent(q)}&page=${p}`}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                          p === currentPage ? "bg-violet-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600"
                        }`}>
                        {p}
                      </Link>
                    ))}
                  </div>
                  {currentPage < productTotalPages ? (
                    <Link href={`/buscar?q=${encodeURIComponent(q)}&page=${currentPage + 1}`}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-violet-300 hover:text-violet-600 transition-colors">
                      Siguiente <NextIcon />
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border border-gray-100 text-gray-300 text-sm font-medium rounded-xl cursor-not-allowed">
                      Siguiente <NextIcon />
                    </span>
                  )}
                </div>
              )}
            </section>
          )}

          {q.trim() && totalResults === 0 && (
            <div className="flex flex-col items-center py-16 gap-3">
              <EmptyIcon />
              <p className="text-gray-500 text-sm">No encontramos resultados</p>
              <p className="text-gray-400 text-xs text-center">
                Intenta con otro término de búsqueda
              </p>
            </div>
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

function ImagePlaceholder() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#d1d5db" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="#d1d5db" />
      <path d="M3 15l5-5 4 4 3-3 6 6" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EmptyIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#d1d5db" strokeWidth="1.5" />
      <path d="M16.5 16.5L21 21" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 11h6M11 8v6" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
