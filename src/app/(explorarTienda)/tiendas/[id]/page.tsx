import { notFound } from "next/navigation"
import Link from "next/link"
import {
  fetchStoreById,
  fetchStoreProducts,
  fetchStorePaymentMethods,
} from "@/app/(explorarTienda)/api/public-explorarTienda.api"
import StoreHeader from "@/components/explorarTienda/store/StoreHeader"
import ShareButton from "@/components/explorarTienda/store/ShareButton"
import StoreStats from "@/components/explorarTienda/store/StoreStats"
import PaymentMethodsRow from "@/components/explorarTienda/store/PaymentMethodsRow"
import StoreTabs from "@/components/explorarTienda/store/StoreTabs"

interface Props {
  params: Promise<{ id: string }>
}

export default async function StoreDetailPage({ params }: Props) {
  const { id } = await params

  const [store, productsRes, paymentMethods] = await Promise.all([
    fetchStoreById(id),
    fetchStoreProducts(id),
    fetchStorePaymentMethods(id),
  ])

  if (!store) notFound()

  return (
    <main className="min-h-screen bg-gray-50 pt-1 md:pt-15">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 pb-28 md:pb-12">

        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/tiendas"
            className="w-9 h-9 text-black rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <BackIcon />
          </Link>

          <h1 className="text-xl font-bold text-gray-900">Tienda</h1>

        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <StoreHeader store={store} />
            </div>
            <ShareButton storeName={store.name} />
          </div>

          <StoreStats
            storeId={store.id}
            whatsapp={store.whatsapp}
            rating={store.rating}
            totalReviews={store.totalReviews}
            totalSales={store.totalSales}
            initialFollowers={store._count.followers}
            totalProducts={store._count.products}
          />
        </div>

        {store.description && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-6 py-5 mb-4">
            <h2 className="text-sm font-bold text-gray-900 mb-2">Sobre la tienda</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{store.description}</p>
          </div>
        )}

        {paymentMethods.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-4">
            <PaymentMethodsRow methods={paymentMethods} />
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <StoreTabs store={store} products={productsRes.data} totalProducts={productsRes.total} />
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
