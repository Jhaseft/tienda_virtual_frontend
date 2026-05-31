import { Suspense } from "react"
import { fetchCategories, fetchRecommendedStores } from "@/app/(explorarTienda)/api/explorarTienda.api"
import HeroBanner from "@/components/explorarTienda/home/HeroBanner"
import CategoryGrid from "@/components/explorarTienda/home/CategoryGrid"
import RecommendedStores from "@/components/explorarTienda/home/RecommendedStores"
import SearchBar from "@/components/explorarTienda/home/SearchBar"

export default async function HomePage() {
  const [categories, stores] = await Promise.all([
    fetchCategories(),
    fetchRecommendedStores(),
  ])

  return (
    <main className="min-h-screen bg-gray-50 pt-4 md:pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 pb-28 md:pb-12">

        <div className="md:hidden mb-4">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>

        <HeroBanner />

        <div className="mt-6 md:mt-8 flex flex-col gap-6 md:gap-10">
          <CategoryGrid categories={categories} />
          <RecommendedStores stores={stores} />
        </div>

      </div>
    </main>
  )
}
