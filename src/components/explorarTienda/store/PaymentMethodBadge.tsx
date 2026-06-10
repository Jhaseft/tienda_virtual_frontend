import { PaymentType } from "@/types/explorar"

interface Props {
  type: PaymentType
}

const CONFIG: Record<PaymentType, { label: string; bg: string; color: string }> = {
  QR:           { label: "QR",          bg: "bg-blue-50",   color: "text-blue-600" },
  YAPE:         { label: "Yape",        bg: "bg-purple-50", color: "text-purple-600" },
  TIGO_MONEY:   { label: "Tigo Money",  bg: "bg-red-50",    color: "text-red-600" },
  EFECTIVO:     { label: "Efectivo",    bg: "bg-green-50",  color: "text-green-600" },
  TRANSFERENCIA:{ label: "Transferencia",bg: "bg-orange-50",color: "text-orange-600" },
  WHATSAPP:     { label: "WhatsApp",     bg: "bg-green-50",  color: "text-green-600" },
}

export default function PaymentMethodBadge({ type }: Props) {
  const { label, bg, color } = CONFIG[type] ?? { label: type, bg: "bg-gray-50", color: "text-gray-600" }

  return (
    <div className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-2xl ${bg} min-w-18`}>
      <PaymentIcon type={type} color={color} />
      <span className={`text-[10px] font-semibold ${color} text-center leading-tight`}>{label}</span>
    </div>
  )
}

function PaymentIcon({ type, color }: { type: PaymentType; color: string }) {
  const cls = `${color}`
  switch (type) {
    case "QR":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
          <rect x="5" y="5" width="3" height="3" fill="currentColor" />
          <rect x="16" y="5" width="3" height="3" fill="currentColor" />
          <rect x="5" y="16" width="3" height="3" fill="currentColor" />
          <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 17h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case "YAPE":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7 12h10M12 8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case "TIGO_MONEY":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case "EFECTIVO":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 12h.01M18 12h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case "TRANSFERENCIA":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={cls} aria-hidden="true">
          <path d="M4 9h16M4 9l4-4M4 9l4 4M20 15H4M20 15l-4-4M20 15l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
  }
}
