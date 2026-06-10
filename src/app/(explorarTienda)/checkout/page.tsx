import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { fetchCart, type CartGroup } from '@/app/(explorarTienda)/api/carrito.api'
import { fetchAddresses } from '@/app/(explorarTienda)/api/addresses.api'
import { fetchStorePaymentMethods, fetchStoreById, fetchStoreShippingZones, fetchProductById } from '@/app/(explorarTienda)/api/public-explorarTienda.api'
import CheckoutClient from '@/components/explorarTienda/checkout/CheckoutClient'
import BackButton from '@/components/ui/BackButton'

interface Props {
  searchParams: Promise<{ storeId?: string; direct?: string; productId?: string; size?: string; color?: string }>
}

export default async function CheckoutPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.backendToken) {
    redirect('/signin?callbackUrl=/carrito')
  }

  const { storeId, direct, productId, size, color } = await searchParams
  if (!storeId) redirect('/carrito')

  const isDirect = direct === '1' && !!productId

  const [addresses, paymentMethods, storeDetail, shippingZones] = await Promise.all([
    fetchAddresses(session.user.backendToken),
    fetchStorePaymentMethods(storeId),
    fetchStoreById(storeId),
    fetchStoreShippingZones(storeId),
  ])

  const storeWhatsapp =
    storeDetail && storeDetail !== 'unavailable' ? (storeDetail.whatsapp ?? null) : null
  const storeInfo = storeDetail && storeDetail !== 'unavailable'
    ? { id: storeId, name: storeDetail.name, logoUrl: storeDetail.logoUrl ?? null }
    : { id: storeId, name: '', logoUrl: null }

  let group: CartGroup

  if (isDirect) {
    const product = await fetchProductById(productId!)
    if (!product) redirect('/carrito')

    group = {
      store: storeInfo,
      subtotal: product.price,
      items: [{
        id: `direct-${product.id}`,
        quantity: 1,
        variant: size ?? null,
        colorName: color ?? null,
        store: storeInfo,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          photos: product.photos,
        },
      }],
    }
  } else {
    const cartGroups = await fetchCart(session.user.backendToken)
    const cartGroup = cartGroups.find((g) => g.store.id === storeId)
    if (!cartGroup || cartGroup.items.length === 0) redirect('/carrito')
    group = cartGroup
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-1 md:pt-15">
      <div className="max-w-6xl mx-auto px-2 lg:px-6 py-4 md:py-8 pb-28 md:pb-12">
        <div className="flex items-center gap-3 self-start w-full">
          <BackButton labelSize="text-2xl" label="Completar transacción" />
        </div>
        <CheckoutClient
          group={group}
          initialAddresses={addresses}
          paymentMethods={paymentMethods}
          shippingZones={shippingZones}
          storeWhatsapp={storeWhatsapp}
          token={session.user.backendToken}
          isDirect={isDirect}
        />
      </div>
    </main>
  )
}
