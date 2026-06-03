"use client"

import { Check, X, Zap, Bot, CreditCard, Package } from "lucide-react"
import type { Plan } from "@/lib/api/subscriptions"

interface Props {
  plan: Plan
  isCurrentPlan: boolean
  onSelectQr: () => void
  onSelectStripe: () => void
}

const PLAN_STYLES: Record<number, { gradient: string; glow: string; shine: boolean; badge: string; accent: string }> = {
  1: {
    gradient: "from-slate-900 to-slate-700",
    glow: "shadow-[0_0_40px_rgba(100,116,139,0.35)] ring-2 ring-slate-400/40",
    shine: false,
    badge: "",
    accent: "text-slate-300",
  },
  2: {
    gradient: "from-violet-600 to-violet-500",
    glow: "shadow-[0_0_40px_rgba(139,92,246,0.45)] ring-2 ring-violet-400/60",
    shine: true,
    badge: "Más popular",
    accent: "text-violet-200",
  },
  3: {
    gradient: "from-yellow-600 via-amber-400 to-yellow-300",
    glow: "shadow-[0_0_60px_rgba(234,179,8,0.6)] ring-2 ring-yellow-400/80",
    shine: true,
    badge: "Premium",
    accent: "text-yellow-100",
  },
}

export default function PlanCard({ plan, isCurrentPlan, onSelectQr, onSelectStripe }: Props) {
  const style = PLAN_STYLES[plan.sortOrder] ?? PLAN_STYLES[1]
  const isUnlimited = plan.maxProducts === -1

  return (
    <div className={`flex flex-col rounded-3xl overflow-hidden shadow-lg ${style.glow}`}>

      {/* Header con gradiente */}
      <div className={`relative bg-linear-to-br ${style.gradient} px-6 pt-6 pb-8 overflow-hidden`}>

        {/* Brillo interno violeta */}
        {style.shine && plan.sortOrder === 2 && (
          <>
            <div className="absolute -top-6 -left-6 w-40 h-40 rounded-full bg-white/20 blur-2xl pointer-events-none" />
            <div className="absolute top-2 left-1/3 w-24 h-10 rounded-full bg-white/30 blur-xl pointer-events-none" />
            <div className="absolute -bottom-4 right-4 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          </>
        )}

        {/* Brillo interno dorado premium */}
        {style.shine && plan.sortOrder === 3 && (
          <>
            <div className="absolute -top-8 -left-8 w-52 h-52 rounded-full bg-white/30 blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-36 h-12 rounded-full bg-white/50 blur-2xl pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-32 h-32 rounded-full bg-yellow-200/40 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-4 left-1/2 w-40 h-16 rounded-full bg-white/20 blur-2xl pointer-events-none" />
            {/* Destello central */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-white/70 blur-md pointer-events-none" />
          </>
        )}

        {style.badge && (
          <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase">
            {style.badge}
          </span>
        )}
        {isCurrentPlan && (
          <span className="absolute top-4 right-4 bg-emerald-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase">
            Activo
          </span>
        )}

        <p className={`text-[10px] font-bold tracking-[0.2em] uppercase ${style.accent} mb-3`}>
          {plan.name}
        </p>

        <div className="flex items-end gap-1.5 mb-0.5">
          <span className={`text-sm font-semibold ${style.accent} mb-2`}>Bs</span>
          <span className="text-5xl font-black text-white leading-none tracking-tight">
            {plan.priceBob}
          </span>
          <span className={`text-sm ${style.accent} mb-1.5`}>/mes</span>
        </div>

        <p className={`text-[14px] font-semibold ${style.accent} opacity-90 mb-4`}>≈ ${plan.priceUsd} USD</p>

        <div className="h-px w-full bg-white/15 mb-3" />

        <p className="text-white/75 text-xs leading-relaxed">{plan.description}</p>
      </div>

      {/* Features */}
      <div className="flex flex-col flex-1 bg-white px-6 py-5 gap-3">
        <ul className="flex flex-col gap-2.5">
          <Feature
            enabled
            label={isUnlimited ? "Productos ilimitados" : `Hasta ${plan.maxProducts} productos`}
            Icon={Package}
          />
          <Feature enabled label="Pedidos por WhatsApp" Icon={Check} />
          <Feature enabled label="Subdominio personalizado" Icon={Check} />
          <Feature
            enabled={plan.canAddPaymentMethods}
            label="Métodos de pago propios"
            Icon={CreditCard}
          />
          <Feature
            enabled={plan.hasAiAgent}
            label="Agente IA"
            Icon={Bot}
          />
          <Feature
            enabled={plan.hasAdvancedPayments}
            label="Pagos avanzados"
            Icon={Zap}
          />
        </ul>

        {!isCurrentPlan && (
          <div className="flex flex-col gap-2 mt-auto pt-3">
            <button
              onClick={onSelectQr}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition active:scale-95 shadow-md ${
                plan.sortOrder === 3
                  ? "bg-linear-to-r from-yellow-600 via-amber-400 to-yellow-300 text-yellow-900 shadow-yellow-300/50"
                  : `bg-linear-to-r ${style.gradient} text-white`
              }`}
            >
              Pagar con QR
            </button>
            <button
              onClick={onSelectStripe}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold border transition active:scale-95 ${
                plan.sortOrder === 3
                  ? "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Pagar con tarjeta
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

function Feature({
  enabled,
  label,
}: {
  enabled: boolean
  label: string
  Icon?: React.ElementType
}) {
  return (
    <li className="flex items-center gap-2.5">
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
          enabled ? "bg-emerald-100" : "bg-gray-100"
        }`}
      >
        {enabled
          ? <Check size={11} className="text-emerald-600" strokeWidth={3} />
          : <X size={11} className="text-gray-400" strokeWidth={3} />
        }
      </span>
      <span className={`text-sm ${enabled ? "text-gray-800" : "text-gray-400 line-through"}`}>
        {label}
      </span>
    </li>
  )
}
