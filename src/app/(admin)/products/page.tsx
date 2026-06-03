"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
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

type Filter = "all" | "visible" | "hidden"

const LIMIT = 20

export default function ProductsPage() {
  const { data: session, status } = useSession()
  const token = session?.user.backendToken

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<InventoryItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [subscription, setSubscription] = useState<MySubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setPage(1)
  }, [filter, search])

  useEffect(() => {
    if (status === "loading" || !token) return
    let active = true
    setIsLoading(true)

    const isVisible = filter === "visible" ? true : filter === "hidden" ? false : undefined

    Promise.all([
      getAdminInventory({ token, search: search || undefined, page, limit: LIMIT, isVisible }),
      page === 1 ? getMySubscription(token) : Promise.resolve(null),
    ])
      .then(([res, sub]) => {
        if (!active) return
        setItems(res.data)
        setTotal(res.total)
        setTotalPages(res.totalPages)
        if (sub) setSubscription(sub)
      })
      .finally(() => { if (active) setIsLoading(false) })

    return () => { active = false }
  }, [token, status, search, filter, page])

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "visible", label: "Publicados" },
    { key: "hidden", label: "No publicados" },
  ]

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
              <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${isActive ? "bg-violet-100 text-violet-600" : "bg-amber-100 text-amber-600"}`}>
                {isActive ? planName : "Periodo de prueba"}
              </span>
              <span className={`text-xs font-semibold ${nearLimit ? "text-red-500" : "text-gray-500"}`}>
                {isUnlimited ? "Ilimitados" : `${used} / ${limit} productos`}
              </span>
            </div>
            {!isUnlimited && (
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-orange-400" : "bg-violet-500"}`}
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

      <div className="flex items-center gap-3 mt-3 mb-2">
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

      <div className="flex gap-2 mb-3">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === key
                ? "bg-violet-600 text-white shadow-sm shadow-violet-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {label}
            {filter === key && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-white/20 text-white">
                {total}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingState text="Cargando productos..." />
      ) : items.length === 0 ? (
        <EmptyState
          title={filter === "hidden" ? "Sin productos ocultos" : filter === "visible" ? "Sin productos publicados" : "Sin productos"}
          description={filter === "all" ? "Aún no tienes productos registrados." : "No hay productos en esta categoría."}
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => <ProductListCard key={item.id} item={item} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 px-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-600 text-sm font-semibold shadow-sm disabled:opacity-30 hover:border-violet-300 hover:text-violet-600 transition-all active:scale-95"
          >
            <ChevronLeft size={15} strokeWidth={2.5} />
            Anterior
          </button>

          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs font-bold text-gray-900">{page} / {totalPages}</span>
            <span className="text-[10px] text-gray-400">{total} productos</span>
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-violet-600 text-white text-sm font-semibold shadow-sm shadow-violet-200 disabled:opacity-30 hover:bg-violet-700 transition-all active:scale-95"
          >
            Siguiente
            <ChevronRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <PageFooterHint message="Gestiona tus productos de manera eficiente y profesional" />

    </AdminShell>
  )
}
