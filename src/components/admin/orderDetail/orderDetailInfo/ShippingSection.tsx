import { Bus, MessageCircle, Store } from "lucide-react"
import { formatTime } from "@/components/explorarTienda/checkout/shipping/shippingUtils"
import type { AdminOrder } from "@/types/admin"
import { TRANSPORT_ICONS, TRANSPORT_LABEL } from "./configs"
import InfoCard from "./InfoCard"

interface Props {
  shippingZone: AdminOrder["shippingZone"]
  pickupMethod: AdminOrder["pickupMethod"]
  paymentMethod: string
}

export default function ShippingSection({ shippingZone, pickupMethod, paymentMethod }: Props) {
  return (
    <div className="px-5 py-4 border-t border-gray-100">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Método de envío</p>
      {shippingZone ? (
        <ZoneCard zone={shippingZone} />
      ) : (
        <PickupCard pickupMethod={pickupMethod} paymentMethod={paymentMethod} />
      )}
    </div>
  )
}

function ZoneCard({ zone }: { zone: NonNullable<AdminOrder["shippingZone"]> }) {
  const Icon = TRANSPORT_ICONS[zone.transportType] ?? Bus
  const price = zone.shippingCost === 0 ? "Gratis" : `Bs. ${zone.shippingCost.toFixed(2)}`
  const sublabel = `${TRANSPORT_LABEL[zone.transportType] ?? zone.transportType} · ${formatTime(zone.minHours, zone.maxHours)}`
  return (
    <InfoCard
      icon={<Icon className="w-5 h-5 text-violet-600" />}
      iconBg="bg-violet-100"
      label={zone.city}
      sublabel={sublabel}
      price={price}
    />
  )
}

function PickupCard({ pickupMethod, paymentMethod }: { pickupMethod: AdminOrder["pickupMethod"]; paymentMethod: string }) {
  const isWhatsapp = pickupMethod === "WHATSAPP" || paymentMethod === "WHATSAPP"
  return (
    <InfoCard
      icon={isWhatsapp
        ? <MessageCircle className="w-5 h-5 text-violet-600" />
        : <Store className="w-5 h-5 text-violet-600" />
      }
      iconBg="bg-violet-100"
      label={isWhatsapp ? "Coordinación por WhatsApp" : "Recojo en tienda"}
      sublabel={isWhatsapp ? "El vendedor acordará la entrega con el cliente" : "Coordinar con el cliente"}
      price="Gratis"
    />
  )
}
