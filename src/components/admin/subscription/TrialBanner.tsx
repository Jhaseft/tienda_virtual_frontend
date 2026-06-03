"use client"

import { useRouter } from "next/navigation"
import { AlertTriangle, Clock, XCircle } from "lucide-react"
import type { MySubscription } from "@/lib/api/subscriptions"

interface Props {
  subscription: MySubscription
}

export default function TrialBanner({ subscription }: Props) {
  const router = useRouter()

  if (subscription.status === "ACTIVE") return null

  const goToPlanes = () => router.push("/planes")

  if (subscription.status === "TRIAL") {
    const urgent = subscription.daysLeft <= 3
    return (
      <button
        onClick={goToPlanes}
        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition active:scale-95 ${
          urgent
            ? "bg-red-50 border border-red-200"
            : "bg-amber-50 border border-amber-200"
        }`}
      >
        <Clock
          size={20}
          className={urgent ? "text-red-500 shrink-0" : "text-amber-500 shrink-0"}
        />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${urgent ? "text-red-700" : "text-amber-700"}`}>
            {urgent
              ? `¡Solo te quedan ${subscription.daysLeft} día${subscription.daysLeft === 1 ? "" : "s"} de prueba!`
              : `Periodo de prueba — ${subscription.daysLeft} días restantes`}
          </p>
          <p className={`text-xs ${urgent ? "text-red-500" : "text-amber-500"}`}>
            Elige un plan y aprovecha los servicios que proveemos
          </p>
        </div>
        <span className={`text-xs font-medium shrink-0 ${urgent ? "text-red-600" : "text-amber-600"}`}>
          Ver planes →
        </span>
      </button>
    )
  }

  if (subscription.status === "TRIAL_EXPIRED") {
    return (
      <button
        onClick={goToPlanes}
        className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left bg-red-50 border border-red-200 transition active:scale-95"
      >
        <XCircle size={20} className="text-red-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-700">
            Tu periodo de prueba ha vencido
          </p>
          <p className="text-xs text-red-500">
            Elige un plan para seguir gestionando tu tienda
          </p>
        </div>
        <span className="text-xs font-medium text-red-600 shrink-0">
          Ver planes →
        </span>
      </button>
    )
  }

  if (subscription.status === "PENDING_PAYMENT") {
    return (
      <button
        onClick={goToPlanes}
        className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left bg-blue-50 border border-blue-200 transition active:scale-95"
      >
        <AlertTriangle size={20} className="text-blue-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-blue-700">
            Pago pendiente de confirmación
          </p>
          <p className="text-xs text-blue-500">
            Tu pago está siendo procesado
          </p>
        </div>
        <span className="text-xs font-medium text-blue-600 shrink-0">
          Ver estado →
        </span>
      </button>
    )
  }

  return null
}
