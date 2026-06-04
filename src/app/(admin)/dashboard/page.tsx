"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import AdminShell from "@/components/admin/home/AdminShell"
import SalesTodayCard from "@/components/admin/home/SalesTodayCard"
import QuickActions from "@/components/admin/home/QuickActions"
import MetricCard from "@/components/admin/home/MetricCard"
import LoadingState from "@/components/admin/home/LoadingState"
import DashboardHeader from "@/components/admin/home/DashboardHeader"
import { getDashboardStats } from "@/lib/api/admin"
import { getMySubscription } from "@/lib/api/subscriptions"
import type { DashboardStats } from "@/types/admin"
import type { MySubscription } from "@/lib/api/subscriptions"
import { Package, ShoppingBag, AlertTriangle, Users } from "lucide-react"
import PageFooterHint from "@/components/ui/PageFooterHint"
import TrialBanner from "@/components/admin/subscription/TrialBanner"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const token = session?.user.backendToken

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [subscription, setSubscription] = useState<MySubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading" || !token) return
    Promise.all([
      getDashboardStats({ token }),
      getMySubscription(token),
    ])
      .then(([s, sub]) => {
        setStats(s)
        setSubscription(sub)
      })
      .finally(() => setIsLoading(false))
  }, [token, status])

  if (isLoading) return (
    <AdminShell title="" hideHeader>
      <LoadingState text="Cargando dashboard..." />
    </AdminShell>
  )

  return (
    <AdminShell title="" hideHeader>
      <div className="flex flex-col gap-3">
        <DashboardHeader
          ownerName={stats?.ownerName ?? null}
          storeName={stats?.storeName ?? null}
        />

        {subscription && <TrialBanner subscription={subscription} />}


        <SalesTodayCard
          total={stats?.salesToday.total ?? 0}
          count={stats?.salesToday.count ?? 0}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            title="Productos"
            value={String(stats?.totalProducts ?? 0)}
            hint="ver todos"
            href="/inventory"
            Icon={Package}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <MetricCard
            title="Pedidos"
            value={String(stats?.totalOrders ?? 0)}
            hint="ver todos"
            href="/orders"
            Icon={ShoppingBag}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
          />
          <MetricCard
            title="Stock bajo"
            value={String(stats?.lowStockCount ?? 0)}
            hint="ver todos"
            href="/inventory"
            Icon={AlertTriangle}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <MetricCard
            title="Clientes"
            value={String(stats?.totalCustomers ?? 0)}
            hint="ver todos"
            href="/customers"
            Icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
        </div>

        <QuickActions storeId={stats?.storeId ?? ""} />

        <div className="-mt-4">
          <PageFooterHint message="Gestiona tu negocio de manera eficiente" />
        </div>

      </div>
    </AdminShell>
  )
}
