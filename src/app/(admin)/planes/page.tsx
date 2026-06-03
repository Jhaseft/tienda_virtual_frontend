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
  const [confirmPlan, setConfirmPlan] = useState<{ plan: Plan; method: "qr" | "stripe" } | null>(null)

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

  const navigate = (planId: string, method: "qr" | "stripe") => {
    if (method === "qr") router.push(`/planes/pago?method=qr&planId=${planId}`)
    else router.push(`/planes/pago/stripe?planId=${planId}`)
  }

  const handleSelectQr = (plan: Plan) => {
    const excess = subscription ? subscription.productsUsed - plan.maxProducts : 0
    if (plan.maxProducts !== -1 && excess > 0) { setConfirmPlan({ plan, method: "qr" }); return }
    navigate(plan.id, "qr")
  }

  const handleSelectStripe = (plan: Plan) => {
    const excess = subscription ? subscription.productsUsed - plan.maxProducts : 0
    if (plan.maxProducts !== -1 && excess > 0) { setConfirmPlan({ plan, method: "stripe" }); return }
    navigate(plan.id, "stripe")
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
              onSelectQr={() => handleSelectQr(plan)}
              onSelectStripe={() => handleSelectStripe(plan)}
            />
          ))}
        </div>

        {/* Modal de confirmación cuando hay productos en exceso */}
        {confirmPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">¿Cambiar a {confirmPlan.plan.name}?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Tienes <strong>{subscription?.productsUsed}</strong> productos pero este plan permite{" "}
                  <strong>{confirmPlan.plan.maxProducts}</strong>. Los{" "}
                  <strong>{(subscription?.productsUsed ?? 0) - confirmPlan.plan.maxProducts}</strong> productos
                  extra se <strong>ocultarán automáticamente</strong> (no se eliminarán). Podrás recuperarlos
                  subiendo de plan.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { navigate(confirmPlan.plan.id, confirmPlan.method); setConfirmPlan(null) }}
                  className="w-full py-3 rounded-2xl bg-violet-600 text-white font-semibold text-sm active:scale-95 transition"
                >
                  Entendido, continuar
                </button>
                <button
                  onClick={() => setConfirmPlan(null)}
                  className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold text-sm active:scale-95 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="-mt-5">
                  <PageFooterHint message="Todos los planes incluyen soporte por WhatsApp" />

        </div>

      </div>
    </AdminShell>
  )
}
