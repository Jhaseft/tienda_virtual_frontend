import { Bus, Plane, Bike, Footprints, Car, QrCode, Building2, Smartphone, Wallet, Banknote, MessageCircle, type LucideIcon } from 'lucide-react'
import type { OrderStatus } from '@/types/orders'
import type { PaymentType } from '@/types/explorar'

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  PENDING:   { label: 'Pendiente',  bg: 'bg-yellow-50',  text: 'text-yellow-700', dot: 'bg-yellow-400' },
  CONFIRMED: { label: 'Confirmado', bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-400'   },
  PAID:      { label: 'Pagado',     bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-400'  },
  SHIPPED:   { label: 'Enviado',    bg: 'bg-purple-50',  text: 'text-purple-700', dot: 'bg-purple-400' },
  DELIVERED: { label: 'Entregado',  bg: 'bg-emerald-50', text: 'text-emerald-800',dot: 'bg-emerald-500'},
  CANCELLED: { label: 'Cancelado',  bg: 'bg-red-50',     text: 'text-red-600',    dot: 'bg-red-400'    },
}

export const TRANSPORT_ICONS: Record<string, LucideIcon> = {
  BUS: Bus, AVION: Plane, MOTO: Bike, A_PIE: Footprints, PROPIO: Car,
}

export const TRANSPORT_LABEL: Record<string, string> = {
  BUS:    'Bus',
  AVION:  'Aéreo',
  MOTO:   'Moto',
  A_PIE:  'A pie',
  PROPIO: 'Vehículo propio',
}

export const PAYMENT_CONFIG: Record<PaymentType, { label: string; Icon: LucideIcon; color: string; bg: string }> = {
  QR:            { label: 'QR Bancario',            Icon: QrCode,        color: 'text-violet-600', bg: 'bg-violet-100' },
  TRANSFERENCIA: { label: 'Transferencia bancaria', Icon: Building2,     color: 'text-blue-600',   bg: 'bg-blue-100'   },
  YAPE:          { label: 'Yape',                   Icon: Smartphone,    color: 'text-purple-600', bg: 'bg-purple-100' },
  TIGO_MONEY:    { label: 'Tigo Money',             Icon: Wallet,        color: 'text-yellow-600', bg: 'bg-yellow-100' },
  EFECTIVO:      { label: 'Efectivo al recibir',    Icon: Banknote,      color: 'text-emerald-600',bg: 'bg-emerald-100'},
  WHATSAPP:      { label: 'Coordinar por WhatsApp', Icon: MessageCircle, color: 'text-green-600',  bg: 'bg-green-100'  },
}
