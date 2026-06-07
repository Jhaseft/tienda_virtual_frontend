import { notFound, redirect } from "next/navigation"
import { fetchStoreIdBySubdomain } from "@/app/(explorarTienda)/api/public-explorarTienda.api"

interface Props {
  params: Promise<{ sub: string; rest: string[] }>
}

export default async function StorefrontCatchAllPage({ params }: Props) {
  const { sub } = await params

  const storeId = await fetchStoreIdBySubdomain(sub)
  if (!storeId) notFound()

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "tiendamas.vip"
  redirect(`https://${rootDomain}/tiendas/${storeId}`)
}
