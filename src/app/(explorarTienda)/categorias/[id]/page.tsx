import { fetchCategories, fetchStoresByCategory } from "@/app/(explorarTienda)/api/explorarTienda.api"
import RecommendedStores from "@/components/explorarTienda/home/RecommendedStores"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

async function getCategoryName(id: string): Promise<string> {
  const categories = await fetchCategories()
  return categories.find(c => c.id === id)?.name ?? "Categoría"
}

export default async function CategoriaDetallePage({ params }: Props) {
  const { id } = await params
  const [stores, categoryName] = await Promise.all([
    fetchStoresByCategory(id),
    getCategoryName(id),
  ])

  return (
    <main className="min-h-screen bg-gray-50 pt-4 md:pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 pb-28 md:pb-12">

        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/categorias"
            className="w-9 h-9 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <BackIcon />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{categoryName}</h1>
          </div>
        </div>

        {stores.length > 0 ? (
          <RecommendedStores stores={stores} showAll />
        ) : (
          <div className="flex flex-col items-center py-20 gap-3">
            <EmptyIcon />
            <p className="text-gray-500 text-sm font-medium">Sin tiendas en esta categoría</p>
            <p className="text-gray-400 text-xs text-center">
              Aún no hay tiendas con productos en {categoryName}.
            </p>
            <Link
              href="/categorias"
              className="mt-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors"
            >
              Ver otras categorías
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EmptyIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9l1-5h16l1 5" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" stroke="#d1d5db" strokeWidth="1.5" />
      <path d="M5 9v11h14V9" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
