import { Bus, MessageCircle, Store } from 'lucide-react'
import ShippingCard from './ShippingCard'
import { TRANSPORT_ICONS, TRANSPORT_LABEL } from './configs'
import { formatTime } from '@/components/explorarTienda/checkout/shipping/shippingUtils'

interface Props {
  shippingZone: {
    city: string
    transportType: string
    minHours: number
    maxHours: number
    shippingCost: number
  } | null
  pickupMethod: 'WHATSAPP' | 'STORE_PICKUP' | null
  paymentMethod: string
}

export default function ShippingSection({ shippingZone, pickupMethod, paymentMethod }: Props) {
  return (
    <div className="px-6 py-4 border-t border-gray-100">
      <h2 className="text-[16px] font-bold text-gray-800 mb-3">Método de envío</h2>
      {shippingZone ? (
        <ZoneCard zone={shippingZone} />
      ) : (
        <PickupCard pickupMethod={pickupMethod} paymentMethod={paymentMethod} />
      )}
    </div>
  )
}

function ZoneCard({ zone }: { zone: NonNullable<Props['shippingZone']> }) {
  const Icon = TRANSPORT_ICONS[zone.transportType] ?? Bus
  const price = zone.shippingCost === 0 ? 'Gratis' : `Bs. ${zone.shippingCost.toFixed(2)}`
  return (
    <ShippingCard
      icon={<Icon className="w-5 h-5 text-violet-600" />}
      label={zone.city}
      sublabel={`${TRANSPORT_LABEL[zone.transportType] ?? zone.transportType} · ${formatTime(zone.minHours, zone.maxHours)}`}
      price={price}
    />
  )
}

function PickupCard({ pickupMethod, paymentMethod }: { pickupMethod: Props['pickupMethod']; paymentMethod: string }) {
  const isWhatsapp = pickupMethod === 'WHATSAPP' || paymentMethod === 'WHATSAPP'
  return (
    <ShippingCard
      icon={isWhatsapp
        ? <MessageCircle className="w-5 h-5 text-violet-600" />
        : <Store className="w-5 h-5 text-violet-600" />
      }
      label={isWhatsapp ? 'Coordinación por WhatsApp' : 'Recojo en tienda'}
      sublabel={isWhatsapp ? 'El vendedor te contactará para acordar la entrega' : 'Coordinar con el vendedor'}
      price="Gratis"
    />
  )
}
