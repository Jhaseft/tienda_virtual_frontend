"use client"

import { motion } from "framer-motion"
import { Check, X, Zap, CreditCard, Package, MessageCircle } from "lucide-react"
import type { Plan } from "@/lib/api/subscriptions"

interface Props {
  plan: Plan
  isCurrentPlan: boolean
  onSelectQr: () => void
  onSelectStripe: () => void
}

const PLAN_STYLES: Record<number, { gradient: string; glow: string; shine: boolean; badge: string; accent: string }> = {
  1: {
    gradient: "from-violet-500 to-violet-400",
    glow: "shadow-lg shadow-violet-400/30",
    shine: false,
    badge: "",
    accent: "text-violet-100",
  },
  2: {
    gradient: "from-violet-800 to-violet-500",
    glow: "shadow-[0_0_40px_rgba(139,92,246,0.5)] ring-2 ring-violet-400/50",
    shine: true,
    badge: "Más popular",
    accent: "text-violet-200",
  },
  3: {
    gradient: "from-violet-950 to-violet-800",
    glow: "shadow-[0_0_80px_rgba(139,92,246,0.9)] ring-2 ring-violet-300/80",
    shine: true,
    badge: "Premium",
    accent: "text-violet-300",
  },
}

export default function PlanCard({ plan, isCurrentPlan, onSelectQr, onSelectStripe }: Props) {
  const style = PLAN_STYLES[plan.sortOrder] ?? PLAN_STYLES[1]
  const isUnlimited = plan.maxProducts === -1
  const isPremium = plan.sortOrder === 3

  return (
    <div className={`flex flex-col rounded-3xl overflow-hidden ${style.glow}`}>

      <div className={`relative bg-linear-to-b ${style.gradient} px-6 pt-6 pb-8 overflow-hidden`}>

        {style.shine && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: isPremium ? 2.2 : 3.5, repeat: Infinity, repeatDelay: isPremium ? 1.5 : 3, ease: "easeInOut" }}
          >
            <div className={`h-full w-1/3 bg-linear-to-r from-transparent via-white/${isPremium ? "25" : "12"} to-transparent skew-x-[-20deg]`} />
          </motion.div>
        )}

        {isPremium && (
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-white/70 blur-sm pointer-events-none"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {style.badge && !isCurrentPlan && (
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

        {plan.priceOferta && (
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm line-through ${style.accent} opacity-60`}>Bs {plan.priceOferta}</span>
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">50% OFF</span>
          </div>
        )}

        <div className="flex items-end gap-1.5 mb-0.5">
          <span className={`text-sm font-semibold ${style.accent} mb-2`}>Bs</span>
          <span className="text-5xl font-black text-white leading-none tracking-tight">
            {plan.priceBob}
          </span>
          <span className={`text-sm ${style.accent} mb-1.5`}>/mes</span>
        </div>

        <p className={`text-[14px] font-semibold ${style.accent} opacity-90 mb-4`}>≈ ${plan.priceUsd} USD</p>

        <div className="h-px w-full bg-white/15 mb-3" />

        <p className="text-white/70 text-xs leading-relaxed">{plan.description}</p>
      </div>

      <div className="flex flex-col flex-1 bg-white px-6 py-5 gap-3">
        {(() => {
          const features = [
            { enabled: true,                     label: isUnlimited ? "Productos ilimitados" : `${plan.maxProducts} productos`, Icon: Package },
            { enabled: true,                     label: "Catálogo de productos",    Icon: Check },
            { enabled: true,                     label: "Subdominio personalizado", Icon: Check },
            { enabled: true,                     label: "Redes sociales",           Icon: Check },
            { enabled: true,                     label: "Pedidos",                  Icon: Check },
            { enabled: true,                     label: "Manejo de inventario",     Icon: Check },
            { enabled: true,                     label: "Métodos de envío",         Icon: Check },
            ...(!plan.hasAdvancedPayments ? [{ enabled: plan.canAddPaymentMethods, label: "Método de pago estático", Icon: CreditCard }] : []),
            { enabled: plan.hasAdvancedPayments, label: "Método de pago API",       Icon: Zap },
            { enabled: plan.hasChat,             label: "Chat de mensajes",         Icon: MessageCircle },
          ]
          const sorted = [...features.filter(f => f.enabled), ...features.filter(f => !f.enabled)]
          return (
            <ul className="flex flex-col gap-2.5">
              {sorted.map((f) => <Feature key={f.label} enabled={f.enabled} label={f.label} Icon={f.Icon} />)}
            </ul>
          )
        })()}

        {!isCurrentPlan && (
          <div className="flex flex-col gap-2 mt-auto pt-3">
            <button
              onClick={onSelectQr}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition active:scale-95 shadow-md bg-linear-to-r ${style.gradient} text-white`}
            >
              Pagar con QR
            </button>
            <button
              onClick={onSelectStripe}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold border transition active:scale-95 ${
                isPremium
                  ? "border-violet-300 text-violet-700 hover:bg-violet-50"
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

function Feature({ enabled, label }: { enabled: boolean; label: string; Icon?: React.ElementType }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${enabled ? "bg-emerald-100" : "bg-gray-100"}`}>
        {enabled
          ? <Check size={11} className="text-emerald-600" strokeWidth={3} />
          : <X size={11} className="text-gray-400" strokeWidth={3} />
        }
      </span>
      <span className={`text-sm ${enabled ? "text-gray-800" : "text-gray-400 line-through"}`}>{label}</span>
    </li>
  )
}
