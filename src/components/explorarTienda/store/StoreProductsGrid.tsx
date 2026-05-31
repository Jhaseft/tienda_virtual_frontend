import { StoreProduct } from "@/types/explorar"
import StoreProductCard from "./StoreProductCard"

interface Props {
  products: StoreProduct[]
}

export default function StoreProductsGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 gap-2">
        <EmptyIcon />
        <p className="text-sm text-gray-400">Esta tienda aún no tiene productos</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {products.map(product => (
        <StoreProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function EmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#d1d5db" strokeWidth="1.5" />
      <path d="M3 9h18M9 21V9" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
