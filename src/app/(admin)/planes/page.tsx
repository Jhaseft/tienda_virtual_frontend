"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import AdminShell from "@/components/admin/home/AdminShell"
import LoadingState from "@/components/admin/home/LoadingState"
import PlanCard from "@/components/admin/subscription/PlanCard"
import { getPlans, getMySubscription } from "@/lib/api/subscriptions"
import type { Plan, MySubscription } from "@/lib/api/subscriptions"
import PageFooterHint from "@/components/ui/PageFooterHint"

export default function PlanesPage() {
  const { data: session, status } = useSession()
  const token = session?.user.backendToken
  const router = useRouter()

  const [plans, setPlans] = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<MySubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    const fetches = token
      ? Promise.all([getPlans(), getMySubscription(token)])
      : getPlans().then((p) => [p, null] as [Plan[], null])

    fetches
      .then(([p, sub]) => {
        setPlans(p)
        setSubscription(sub)
      })
      .finally(() => setIsLoading(false))
  }, [token, status])

  const handleSelectQr = (planId: string) => {
    router.push(`/planes/pago?method=qr&planId=${planId}`)
  }

  const handleSelectStripe = (planId: string) => {
    router.push(`/planes/pago/stripe?planId=${planId}`)
  }

  if (isLoading) return (
    <AdminShell title="Planes">
      <LoadingState text="Cargando planes..." />
    </AdminShell>
  )

  return (
    <AdminShell title="Elige tu plan">
      <div className="flex flex-col gap-4">

        {subscription?.status === "TRIAL" && (
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-violet-600 to-violet-500 px-5 py-4 shadow-lg shadow-violet-200">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-violet-200 mb-0.5">Estado actual</p>
            <p className="text-white font-bold text-base">Periodo de prueba activo</p>
            <p className="text-violet-200 text-xs mt-0.5">
              Te quedan <span className="text-white font-black">{subscription.daysLeft} días</span> — elige un plan para no perder el acceso
            </p>
          </div>
        )}

        {subscription?.status === "TRIAL_EXPIRED" && (
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-red-600 to-rose-500 px-5 py-4 shadow-lg shadow-red-200">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-red-200 mb-0.5">Acceso restringido</p>
            <p className="text-white font-bold text-base">Tu periodo de prueba venció</p>
            <p className="text-red-200 text-xs mt-0.5">Activa un plan para seguir gestionando tu tienda</p>
          </div>
        )}

        {subscription?.status === "PENDING_PAYMENT" && (
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-amber-500 to-orange-400 px-5 py-4 shadow-lg shadow-amber-200">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-amber-100 mb-0.5">Pago en proceso</p>
            <p className="text-white font-bold text-base">Confirmando tu pago</p>
            <p className="text-amber-100 text-xs mt-0.5">Tu pago está siendo verificado, en breve se activará tu plan</p>
          </div>
        )}

        {subscription?.status === "ACTIVE" && subscription.plan && (
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-600 to-teal-500 px-5 py-4 shadow-lg shadow-emerald-200">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-emerald-200 mb-0.5">Plan activo</p>
            <p className="text-white font-bold text-base">{subscription.plan.name}</p>
            <p className="text-emerald-200 text-xs mt-0.5">
              Vence en <span className="text-white font-black">{subscription.daysLeft} días</span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={subscription?.plan?.id === plan.id && subscription.status === "ACTIVE"}
              onSelectQr={() => handleSelectQr(plan.id)}
              onSelectStripe={() => handleSelectStripe(plan.id)}
            />
          ))}
        </div>

        <div className="-mt-5">
                  <PageFooterHint message="Todos los planes incluyen soporte por WhatsApp" />

        </div>

      </div>
    </AdminShell>
  )
}
