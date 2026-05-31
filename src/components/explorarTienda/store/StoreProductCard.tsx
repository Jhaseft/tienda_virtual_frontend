import Image from "next/image"
import Link from "next/link"
import { StoreProduct } from "@/types/explorar"

interface Props {
  product: StoreProduct
}

export default function StoreProductCard({ product }: Props) {
  return (
    <Link
      href={`/productos/${product.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-100 transition-all group"
    >
      {/* Foto */}
      <div className="relative w-full aspect-square bg-gray-50">
        {product.photos[0] ? (
          <Image
            src={product.photos[0].url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImagePlaceholder />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs font-semibold text-gray-900 truncate">{product.name}</p>
        {product.category && (
          <p className="text-[10px] text-gray-400 truncate mt-0.5">{product.category.name}</p>
        )}
        <p className="text-sm font-bold text-violet-600 mt-1.5">
          Bs {product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}

function ImagePlaceholder() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#e5e7eb" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="#e5e7eb" />
      <path d="M3 15l5-5 4 4 3-3 6 6" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
