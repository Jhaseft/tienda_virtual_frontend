'use client'

import { useState } from "react"
import { Loader2, Check, Bus, Plane, Bike, Footprints, Car, type LucideIcon } from "lucide-react"
import type { ShippingZone, CreateShippingZonePayload, TransportType } from "@/types/shippingZone"
import { TRANSPORT_CONFIG } from "@/types/shippingZone"
import ZoneForm from "./ZoneForm"
import { formatTime } from "./shippingZoneUtils"

const TRANSPORT_ICONS: Record<TransportType, LucideIcon> = {
  BUS:    Bus,
  AVION:  Plane,
  MOTO:   Bike,
  A_PIE:  Footprints,
  PROPIO: Car,
}

export type ZoneCardMode = 'normal' | 'deleting' | 'editing'

interface Props {
  zone: ShippingZone
  mode: ZoneCardMode
  selected: boolean
  isSaving: boolean
  onToggleSelect: () => void
  onUpdate: (dto: Partial<CreateShippingZonePayload & { isActive: boolean }>) => Promise<void>
  onEditClick: () => void
  editingInline: boolean
  onEditSave: (dto: CreateShippingZonePayload) => Promise<void>
  onEditCancel: () => void
}

export default function ZoneCard({
  zone, mode, selected, isSaving,
  onToggleSelect, onUpdate,
  editingInline, onEditSave, onEditCancel,
}: Props) {
  const [toggling, setToggling] = useState(false)
  const cfg = TRANSPORT_CONFIG[zone.transportType]
  const Icon = TRANSPORT_ICONS[zone.transportType]

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setToggling(true)
    await onUpdate({ isActive: !zone.isActive })
    setToggling(false)
  }

  const isDeleting = mode === 'deleting'
  const isEditing  = mode === 'editing'

  const cardBase = `rounded-2xl border transition-all duration-200`
  const cardColor = isDeleting && selected
    ? 'border-red-400 bg-red-50 shadow-sm'
    : isDeleting
    ? 'border-dashed border-gray-200 bg-white hover:border-red-300'
    : isEditing
    ? 'border-violet-200 bg-white hover:border-violet-400 hover:shadow-md cursor-pointer'
    : zone.isActive
    ? 'border-gray-100 bg-white shadow-sm'
    : 'border-dashed border-gray-200 bg-gray-50'

  return (
    <div
      className={`${cardBase} ${cardColor}`}
      onClick={(isDeleting || isEditing) ? onToggleSelect : undefined}
    >
      {editingInline ? (
        <div className="p-4">
          <ZoneForm
            initial={{
              city: zone.city,
              transportType: zone.transportType,
              shippingCost: zone.shippingCost,
              minHours: zone.minHours,
              maxHours: zone.maxHours,
            }}
            isSaving={isSaving}
            onSave={onEditSave}
            onCancel={onEditCancel}
          />
        </div>
      ) : (
        <div className={`flex gap-3 px-4 py-3.5 ${!zone.isActive && !isDeleting && !isEditing ? 'opacity-50' : ''}`}>

          {isDeleting && (
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-2.5 transition-all ${
              selected ? 'bg-red-500 border-red-500' : 'border-gray-300'
            }`}>
              {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>
          )}

          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            isDeleting && selected ? 'bg-red-100' : 'bg-violet-50'
          }`}>
            <Icon className={`w-5 h-5 ${isDeleting && selected ? 'text-red-500' : 'text-gray-700'}`} />
          </div>

          <div className="flex-1 min-w-0">

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{zone.city}</p>
                {!zone.isActive && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full shrink-0">
                    Inactiva
                  </span>
                )}
              </div>
              <p className={`text-sm font-bold shrink-0 ${zone.shippingCost === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                {zone.shippingCost === 0 ? 'Gratis' : `Bs. ${zone.shippingCost.toFixed(2)}`}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1">
              <div className="min-w-0">
                <p className="text-xs text-gray-400 leading-relaxed">
                  <span className="font-medium text-gray-500">{cfg.label}</span>
                  {' · '}
                  {formatTime(zone.minHours, zone.maxHours)}
                </p>
              </div>

              {mode === 'normal' && (
                <button
                  onClick={handleToggle}
                  disabled={toggling}
                  title={zone.isActive ? 'Desactivar zona' : 'Activar zona'}
                  className={`h-6 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all disabled:opacity-40 shrink-0 ${
                    zone.isActive
                      ? 'bg-violet-50 text-violet-600 hover:bg-violet-100'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {toggling
                    ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    : <span className={`w-1.5 h-1.5 rounded-full ${zone.isActive ? 'bg-violet-500' : 'bg-gray-400'}`} />
                  }
                  {zone.isActive ? 'Activa' : 'Inactiva'}
                </button>
              )}

              {isEditing && (
                <span className="text-[11px] text-violet-400 shrink-0">Toca para editar</span>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
