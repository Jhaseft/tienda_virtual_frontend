import type { LucideIcon } from "lucide-react"
import { QrCode, Building2, Smartphone, Banknote, Wallet } from "lucide-react"
import type { StorePaymentMethod } from "@/types/admin"

export type PaymentType = StorePaymentMethod["type"]

export const PAYMENT_CONFIG: Record<PaymentType, { label: string; Icon: LucideIcon; color: string; bg: string }> = {
  QR:            { label: "QR",           Icon: QrCode,     color: "text-violet-600", bg: "bg-violet-50" },
  TRANSFERENCIA: { label: "Transferencia",Icon: Building2,  color: "text-blue-600",   bg: "bg-blue-50"   },
  YAPE:          { label: "Yape",         Icon: Smartphone, color: "text-purple-600", bg: "bg-purple-50" },
  TIGO_MONEY:    { label: "Tigo Money",   Icon: Wallet,     color: "text-yellow-600", bg: "bg-yellow-50" },
  EFECTIVO:      { label: "Efectivo",     Icon: Banknote,   color: "text-emerald-600",bg: "bg-emerald-50"},
}

export const PAYMENT_TYPES = Object.keys(PAYMENT_CONFIG) as PaymentType[]
