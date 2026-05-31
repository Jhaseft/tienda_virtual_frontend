import Image from "next/image"
import Link from "next/link"
import { Category } from "@/types/explorar"

const COLORS = [
  "bg-pink-100",
  "bg-green-100",
  "bg-orange-100",
  "bg-purple-100",
  "bg-blue-100",
  "bg-cyan-100",
  "bg-yellow-100",
  "bg-rose-100",
]

interface Props {
  category: Category
  index: number
}

export default function CategoryCard({ category, index }: Props) {
  const color = COLORS[index % COLORS.length]

  return (
    <Link
      href={`/categorias/${category.id}`}
      className="flex flex-col items-center gap-2 group"
    >
      <div className={`relative w-16 h-16 md:w-24 md:h-24 rounded-full ${color} overflow-hidden flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
        {category.iconUrl ? (
          <Image
            src={category.iconUrl}
            alt={category.name}
            fill
            className="object-cover"
          />
        ) : (
          <CategoryPlaceholder />
        )}
      </div>
      <span className="text-xs md:text-sm text-gray-700 font-medium text-center leading-tight max-w-16 md:max-w-24 truncate">
        {category.name}
      </span>
    </Link>
  )
}

function CategoryPlaceholder() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="#9333ea" strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="2" stroke="#9333ea" strokeWidth="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="#9333ea" strokeWidth="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="2" stroke="#9333ea" strokeWidth="1.5" />
    </svg>
  )
}
