import Link from "next/link"
import CategoryCard from "./CategoryCard"
import { Category } from "@/types/explorar"

interface Props {
  categories: Category[]
  showAll?: boolean
}

export default function CategoryGrid({ categories, showAll = false }: Props) {
  const slice = showAll ? categories : categories.slice(0, 7)
  const hasMore = !showAll && categories.length > 6

  return (
    <section>
      {!showAll && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900">Categorías</h2>
        </div>
      )}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4">
        {slice.map((cat, i) => (
          <div key={cat.id} className={!showAll && i === 6 ? "md:hidden" : ""}>
            <CategoryCard category={cat} index={i} />
          </div>
        ))}
        {hasMore && (
          <Link href="/categorias" className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MoreIcon />
            </div>
            <span className="text-xs md:text-sm text-gray-500 font-medium">Más</span>
          </Link>
        )}
      </div>
    </section>
  )
}

function MoreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="5" cy="12" r="1.5" fill="#6b7280" />
      <circle cx="12" cy="12" r="1.5" fill="#6b7280" />
      <circle cx="19" cy="12" r="1.5" fill="#6b7280" />
    </svg>
  )
}
