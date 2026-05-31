"use client"

import { useEffect, useState } from "react"
import type { PaymentMethod, PaymentType } from "@/types/explorar"
import PaymentDetail from "./PaymentDetail"
import PaymentConfirmation from "./PaymentConfirmation"

const PAYMENT_CONFIG: Record<PaymentType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  QR: {
    label: "Código QR",
    icon: <QRIcon />,
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-100",
  },
  YAPE: {
    label: "Yape",
    icon: <YapeIcon />,
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-100",
  },
  TIGO_MONEY: {
    label: "Tigo Money",
    icon: <TigoIcon />,
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-100",
  },
  EFECTIVO: {
    label: "Efectivo",
    icon: <CashIcon />,
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-100",
  },
  TRANSFERENCIA: {
    label: "Transferencia Bancaria",
    icon: <BankIcon />,
    color: "text-sky-700",
    bg: "bg-sky-50 border-sky-100",
  },
}

interface Props {
  methods: PaymentMethod[]
  whatsapp: string | null
  productName: string
  onClose: () => void
}

export default function PaymentModal({ methods, whatsapp, productName, onClose }: Props) {
  const [selected, setSelected] = useState<PaymentMethod | null>(null)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (confirming) { setConfirming(false) }
        else if (selected) { setSelected(null) }
        else { onClose() }
      }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose, selected, confirming])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 pb-4 sm:pb-0"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300">

        <div className="relative bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-5">
          <div className="flex items-center gap-3">
            {selected ? (
              <button
                onClick={() => confirming ? setConfirming(false) : setSelected(null)}
                className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
              >
                <BackIconWhite />
              </button>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <CreditCardIconLarge />
              </div>
            )}
            <div>
              <h2 className="text-white font-bold text-base">
                {confirming ? "Confirmar pago" : selected ? PAYMENT_CONFIG[selected.type].label : "Métodos de pago"}
              </h2>
              <p className="text-emerald-100 text-xs mt-0.5">
                {confirming
                  ? "Revisa los datos antes de enviar"
                  : selected
                    ? "Datos para realizar el pago"
                    : methods.length > 0
                      ? `${methods.length} opción${methods.length > 1 ? "es" : ""} disponible${methods.length > 1 ? "s" : ""}`
                      : "Sin métodos registrados"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {confirming && selected ? (
          <div className="max-h-screen md:max-h-[80vh] overflow-y-auto">
            <PaymentConfirmation
              method={selected}
              whatsapp={whatsapp}
              productName={productName}
              onClose={onClose}
            />
          </div>
        ) : selected ? (
          <div className="max-h-screen md:max-h-[80vh] overflow-y-auto">
            <PaymentDetail
              method={selected}
              onNotify={() => setConfirming(true)}
            />
          </div>
        ) : (
          <>
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {methods.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <EmptyIcon />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Esta tienda no tiene<br />métodos de pago registrados.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {methods.map((m) => {
                    const config = PAYMENT_CONFIG[m.type]
                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelected(m)}
                        className={`w-full border rounded-2xl overflow-hidden ${config.bg} hover:brightness-95 transition-all`}
                      >
                        <div className="flex items-center gap-3 px-4 py-3.5">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-white flex items-center justify-center shrink-0">
                            {config.icon}
                          </div>
                          <span className={`text-sm font-bold tracking-tight ${config.color}`}>{config.label}</span>
                          <div className="ml-auto">
                            <ChevronIcon />
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
              >
                Cerrar
              </button>
            </div>

          </>
        )}

      </div>
    </div>
  )
}

function BackIconWhite() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function CreditCardIconLarge() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function QRIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3" />
    </svg>
  )
}

function YapeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7e22ce" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function TigoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  )
}

function CashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  )
}

function BankIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function EmptyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}
