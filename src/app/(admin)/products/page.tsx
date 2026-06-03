"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Plus } from "lucide-react"
import Link from "next/link"
import AdminShell from "@/components/admin/home/AdminShell"
import ProductListCard from "@/components/admin/products/ProductListCard"
import LoadingState from "@/components/admin/home/LoadingState"
import EmptyState from "@/components/admin/home/EmptyState"
import SearchInput from "@/components/admin/home/SearchInput"
import { getAdminInventory } from "@/lib/api/admin"
import { getMySubscription } from "@/lib/api/subscriptions"
import type { InventoryItem } from "@/types/admin"
import type { MySubscription } from "@/lib/api/subscriptions"
import PageFooterHint from "@/components/ui/PageFooterHint"

export default function ProductsPage() {
  const { data: session, status } = useSession()
  const token = session?.user.backendToken

  const [search, setSearch] = useState("")
  const [items, setItems] = useState<InventoryItem[]>([])
  const [subscription, setSubscription] = useState<MySubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading" || !token) return
    let active = true
    Promise.all([
      getAdminInventory({ token, search: search || undefined, limit: 100 }),
      getMySubscription(token),
    ])
      .then(([res, sub]) => {
        if (active) {
          setItems(res.data)
          setSubscription(sub)
        }
      })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [token, status, search])

  return (
    <AdminShell title="Mis Productos" subtitle="Todos tus productos">

      {subscription && (() => {
        const used = subscription.productsUsed
        const limit = subscription.productsLimit
        const isUnlimited = limit === -1
        const pct = isUnlimited ? 0 : Math.min(100, Math.round((used / limit) * 100))
        const nearLimit = !isUnlimited && pct >= 80
        const planName = subscription.plan?.name ?? null
        const isActive = subscription.status === "ACTIVE"

        return (
          <div className={`rounded-2xl border px-4 py-3 mb-1 ${nearLimit ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${isActive
                    ? "bg-violet-100 text-violet-600"
                    : "bg-amber-100 text-amber-600"
                  }`}>
                  {isActive ? planName : "Periodo de prueba"}
                </span>
              </div>
              <span className={`text-xs font-semibold ${nearLimit ? "text-red-500" : "text-gray-500"}`}>
                {isUnlimited ? "Ilimitados" : `${used} / ${limit} productos`}
              </span>
            </div>

            {!isUnlimited && (
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-orange-400" : "bg-violet-500"
                    }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}

            {nearLimit && !isUnlimited && (
              <p className="text-[11px] text-red-500 mt-1.5 font-medium">
                {pct >= 100 ? "Límite alcanzado — elige un plan superior" : `Solo te quedan ${limit - used} producto${limit - used === 1 ? "" : "s"} disponibles`}
              </p>
            )}
          </div>
        )
      })()}

      <div className="flex items-center gap-3 mt-4 mb-4">

        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar producto" />
        </div>
        <Link
          href="/products/new"
          className="flex items-center gap-2 shrink-0 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white text-sm font-semibold px-4 py-2.5 transition-all shadow-sm shadow-violet-200"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Agregar</span>
        </Link>
      </div>

      {isLoading ? (
        <LoadingState text="Cargando productos..." />
      ) : items.length === 0 ? (
        <EmptyState title="Sin productos" description="Aún no tienes productos registrados." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => <ProductListCard key={item.id} item={item} />)}
        </div>
      )}


      <PageFooterHint message="Gestiona tus productos de manera eficiente y profesional" />

    </AdminShell>
  )
}
