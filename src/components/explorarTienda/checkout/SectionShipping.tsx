'use client'

import { Store, Bus, MessageCircle } from 'lucide-react'
import type { ShippingZoneOption, ShippingZoneGroup } from '@/app/(explorarTienda)/api/public-explorarTienda.api'
import ShippingRow from './shipping/ShippingRow'
import { TRANSPORT_ICONS, TRANSPORT_LABELS } from './shipping/shippingConfig'
import { formatTime } from './shipping/shippingUtils'

interface Props {
  zones: ShippingZoneGroup[]
  selectedZoneId: string | null
  onSelect: (zone: ShippingZoneOption | null) => void
}

export default function SectionShipping({ zones, selectedZoneId, onSelect }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Método de envío</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {zones.length > 0
            ? <>Si vives en una de las ciudades disponibles, selecciona el envío a domicilio. De lo contrario, elige <span className="font-medium text-gray-700">Recojo en tienda</span> o coordina por WhatsApp.</>
            : <>Esta tienda no tiene zonas de envío configuradas. Puedes recoger en tienda o coordinar la entrega por WhatsApp.</>
          }
        </p>
      </div>

      <div className="px-4 py-3 flex flex-col gap-2">
        {zones.map((group) => (
          <div key={group.city}>
            <div className="flex flex-col gap-2">
              {group.options.map((opt) => {
                const Icon = TRANSPORT_ICONS[opt.transportType] ?? Bus
                const label = TRANSPORT_LABELS[opt.transportType] ?? opt.transportType
                return (
                  <ShippingRow
                    key={opt.id}
                    isSelected={selectedZoneId === opt.id}
                    onClick={() => onSelect(selectedZoneId === opt.id ? null : opt)}
                    icon={<Icon className={`w-5 h-5 ${selectedZoneId === opt.id ? 'text-violet-600' : 'text-gray-700'}`} />}
                    label={group.city}
                    sublabel={`${label} · ${formatTime(opt.minHours, opt.maxHours)}`}
                    price={opt.shippingCost === 0 ? 'Gratis' : `Bs. ${opt.shippingCost.toFixed(2)}`}
                  />
                )
              })}
            </div>
          </div>
        ))}

        <ShippingRow
          isSelected={selectedZoneId === null}
          onClick={() => onSelect(null)}
          icon={<Store className={`w-5 h-5 ${selectedZoneId === null ? 'text-violet-600' : 'text-gray-700'}`} />}
          label="Recojo en tienda"
          sublabel="Coordinar con el vendedor"
          price="Gratis"
        />

        <ShippingRow
          isSelected={selectedZoneId === 'WHATSAPP'}
          onClick={() => onSelect(selectedZoneId === 'WHATSAPP' ? null : { id: 'WHATSAPP' } as never)}
          icon={<MessageCircle className={`w-5 h-5 ${selectedZoneId === 'WHATSAPP' ? 'text-violet-600' : 'text-gray-700'}`} />}
          label="Coordinación por WhatsApp"
          sublabel="El vendedor te contactará para acordar la entrega"
          price="Gratis"
        />
      </div>
    </div>
  )
}
