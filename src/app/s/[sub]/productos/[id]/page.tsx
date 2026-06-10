import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { fetchProductById } from "@/app/(explorarTienda)/api/public-explorarTienda.api"
import ProductImageCarousel from "@/components/explorarTienda/product/ProductImageCarousel"
import ProductClientSection from "@/components/explorarTienda/product/ProductClientSection"

interface Props {
  params: Promise<{ sub: string; id: string }>
}

export default async function StorefrontProductDetailPage({ params }: Props) {
  const { id } = await params
  const product = await fetchProductById(id)

  if (!product) notFound()

  const stockLabel = `${product.stock} unidades`

  return (
    <main className="min-h-screen bg-gray-50 pt-4 md:pt-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8 pb-28 md:pb-12">

        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="w-9 h-9 text-black rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <BackIcon />
          </Link>

          <h1 className="text-xl font-bold text-gray-900">{product.store.name}</h1>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div>
            <ProductImageCarousel photos={product.photos} productName={product.name} />
          </div>

          <div className="flex flex-col gap-5">

            <div>
              {product.category && (
                <span className="text-xs text-violet-600 font-medium uppercase tracking-wide">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-3xl font-bold text-violet-600">
                Bs {product.price.toFixed(2)}
              </span>
              <span className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${product.isAvailable
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-500"
                }`}>
                <span className="text-[8px]">●</span>
                {product.isAvailable ? "Disponible" : "Agotado"}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Stock: <span className="font-semibold text-gray-700">{stockLabel}</span>
            </p>

            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            )}

            <Link
              href="/"
              className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm hover:border-violet-200 transition-colors"
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-violet-50 shrink-0">
                {product.store.logoUrl ? (
                  <Image src={product.store.logoUrl} alt={product.store.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <StoreIcon />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{product.store.name}</p>
                {product.store.city && (
                  <p className="text-xs text-gray-400 truncate">{product.store.city}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <StarIcon />
                <span className="text-sm font-bold text-amber-500">{product.store.rating.toFixed(1)}</span>
              </div>
            </Link>

            <ProductClientSection
              productId={product.id}
              productName={product.name}
              price={product.price}
              stock={product.stock}
              whatsapp={product.store.whatsapp}
              storeName={product.store.name}
              storeId={product.store.id}
              sizes={product.sizes}
              colors={product.colors}
            />

          </div>
        </div>

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

function StoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9l1-5h16l1 5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" stroke="#7c3aed" strokeWidth="1.5" />
      <path d="M5 9v11h14V9" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
