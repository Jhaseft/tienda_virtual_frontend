import { notFound } from "next/navigation"
import {
  fetchStoreById,
  fetchStoreIdBySubdomain,
  fetchStoreProducts,
  fetchStorePaymentMethods,
} from "@/app/(explorarTienda)/api/public-explorarTienda.api"
import StoreHeader from "@/components/explorarTienda/store/StoreHeader"
import ShareButton from "@/components/explorarTienda/store/ShareButton"
import StoreStats from "@/components/explorarTienda/store/StoreStats"
import PaymentMethodsRow from "@/components/explorarTienda/store/PaymentMethodsRow"
import StoreTabs from "@/components/explorarTienda/store/StoreTabs"
import StoreUnavailable from "@/components/explorarTienda/store/StoreUnavailable"

interface Props {
  params: Promise<{ sub: string }>
}

export default async function StoreBySubdomainPage({ params }: Props) {
  const { sub } = await params

  const storeId = await fetchStoreIdBySubdomain(sub)
  if (!storeId) notFound()

  const [store, productsRes, paymentMethods] = await Promise.all([
    fetchStoreById(storeId),
    fetchStoreProducts(storeId),
    fetchStorePaymentMethods(storeId),
  ])

  if (store === "unavailable") return <StoreUnavailable />
  if (!store) notFound()
  // TypeScript narrowing: after the guards above, store is StoreDetail
  const storeData = store as Exclude<typeof store, null | "unavailable">

  return (
    <main className="min-h-screen bg-gray-50 pt-1 md:pt-15">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 pb-28 md:pb-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <StoreHeader store={store} />
            </div>
            <ShareButton storeName={storeData.name} />
          </div>

          <StoreStats
            storeId={storeData.id}
            whatsapp={storeData.whatsapp}
            rating={storeData.rating}
            totalReviews={storeData.totalReviews}
            totalSales={storeData.totalSales}
            initialFollowers={storeData._count.followers}
            totalProducts={storeData._count.products}
            socialLinks={storeData.socialLinks}
          />
        </div>

        {storeData.description && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-6 py-5 mb-4">
            <h2 className="text-sm font-bold text-gray-900 mb-2">Sobre la tienda</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{storeData.description}</p>
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
