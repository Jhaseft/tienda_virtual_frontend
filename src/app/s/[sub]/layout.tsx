import { fetchStoreIdBySubdomain } from "@/app/(explorarTienda)/api/public-explorarTienda.api"
import { StorefrontProvider } from "@/contexts/StorefrontContext"

interface Props {
  params: Promise<{ sub: string }>
  children: React.ReactNode
}

export default async function StorefrontLayout({ params, children }: Props) {
  const { sub } = await params
  const storeId = await fetchStoreIdBySubdomain(sub)
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "tiendamas.vip"
  const mainDomainStoreUrl = storeId ? `https://${rootDomain}/tiendas/${storeId}` : null

  return (
    <StorefrontProvider
      value={{ isSubdomain: true, sub, storeId, mainDomainStoreUrl }}
    >
      {children}
    </StorefrontProvider>
  )
}
