"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { SlidersHorizontal } from "lucide-react"
import AdminShell from "@/components/admin/home/AdminShell"
import ProductListCard from "@/components/admin/products/ProductListCard"
import LoadingState from "@/components/admin/home/LoadingState"
import EmptyState from "@/components/admin/home/EmptyState"
import SearchInput from "@/components/admin/home/SearchInput"
import { getAdminInventory } from "@/lib/api/admin"
import type { InventoryItem } from "@/types/admin"
import PageFooterHint from "@/components/ui/PageFooterHint"

export default function ProductsPage() {
  const { data: session, status } = useSession()
  const token = session?.user.backendToken

  const [search, setSearch] = useState("")
  const [items, setItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading" || !token) return
    let active = true
    getAdminInventory({ token, search: search || undefined, limit: 100 })
      .then((res) => { if (active) setItems(res.data) })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [token, status, search])

  return (
    <AdminShell title="Mis Productos" subtitle="Todos tus productos">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar producto" />
        </div>
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
