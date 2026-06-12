import { Bus, Plane, Bike, Footprints, Car, MessageCircle, QrCode, Building2, Smartphone, Wallet, Banknote, type LucideIcon } from "lucide-react"

export const TRANSPORT_ICONS: Record<string, LucideIcon> = {
  BUS: Bus, AVION: Plane, MOTO: Bike, A_PIE: Footprints, PROPIO: Car,
}

export const TRANSPORT_LABEL: Record<string, string> = {
  BUS: "Bus", AVION: "Aéreo", MOTO: "Moto", A_PIE: "A pie", PROPIO: "Vehículo propio",
}

export const PAYMENT_CONFIG: Record<string, { label: string; Icon: LucideIcon; color: string; bg: string }> = {
  QR:            { label: "QR Bancario",            Icon: QrCode,        color: "text-violet-600", bg: "bg-violet-100" },
  TRANSFERENCIA: { label: "Transferencia bancaria", Icon: Building2,     color: "text-blue-600",   bg: "bg-blue-100"   },
  YAPE:          { label: "Yape",                   Icon: Smartphone,    color: "text-purple-600", bg: "bg-purple-100" },
  TIGO_MONEY:    { label: "Tigo Money",             Icon: Wallet,        color: "text-yellow-600", bg: "bg-yellow-100" },
  EFECTIVO:      { label: "Efectivo al recibir",    Icon: Banknote,      color: "text-emerald-600",bg: "bg-emerald-100"},
  WHATSAPP:      { label: "Coordinar por WhatsApp", Icon: MessageCircle, color: "text-green-600",  bg: "bg-green-100"  },
}
