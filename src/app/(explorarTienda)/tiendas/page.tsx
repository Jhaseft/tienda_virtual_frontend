import { fetchRecommendedStores } from "@/app/(explorarTienda)/api/explorarTienda.api"
import RecommendedStores from "@/components/explorarTienda/home/RecommendedStores"
import Link from "next/link"

export default async function TiendasPage() {
  const stores = await fetchRecommendedStores()

  return (
    <main className="min-h-screen bg-gray-50 pt-4 md:pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 pb-28 md:pb-12">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="w-9 h-9 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <BackIcon />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Tiendas recomendadas</h1>
        </div>
        <RecommendedStores stores={stores} showAll />
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
