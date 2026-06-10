'use client'

import { useState } from "react"
import { Loader2, Check, X, Bus, Plane, Bike, Footprints, Car, type LucideIcon } from "lucide-react"
import type { CreateShippingZonePayload, TransportType } from "@/types/shippingZone"
import { TRANSPORT_CONFIG, TRANSPORT_OPTIONS } from "@/types/shippingZone"

const TRANSPORT_ICONS: Record<TransportType, LucideIcon> = {
  BUS: Bus, AVION: Plane, MOTO: Bike, A_PIE: Footprints, PROPIO: Car,
}

interface Props {
  initial: CreateShippingZonePayload
  isSaving: boolean
  onSave: (dto: CreateShippingZonePayload) => void
  onCancel: () => void
}

export default function ZoneForm({ initial, isSaving, onSave, onCancel }: Props) {
  const [form, setForm] = useState<CreateShippingZonePayload>(initial)

  const set = <K extends keyof CreateShippingZonePayload>(k: K, v: CreateShippingZonePayload[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const valid = form.city.trim().length > 0 && form.minHours < form.maxHours && form.shippingCost >= 0

  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">

        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">Ciudad / Destino</label>
          <input
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            placeholder="Ej: Cochabamba"
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>

        <div className="col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-gray-600">Transporte</label>
          <div className="flex gap-2 flex-wrap">
            {TRANSPORT_OPTIONS.map((t) => {
              const Icon = TRANSPORT_ICONS[t]
              const active = form.transportType === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('transportType', t)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    active
                      ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {TRANSPORT_CONFIG[t].label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Costo de envío (Bs.)</label>
          <input
            type="number"
            min={0}
            value={form.shippingCost}
            onChange={(e) => set('shippingCost', Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Mín. horas entrega</label>
          <input
            type="number"
            min={0}
            value={form.minHours}
            onChange={(e) => set('minHours', Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Máx. horas entrega</label>
          <input
            type="number"
            min={1}
            value={form.maxHours}
            onChange={(e) => set('maxHours', Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>

      </div>

      {form.minHours >= form.maxHours && (
        <p className="text-xs text-red-500">El mínimo debe ser menor al máximo de horas.</p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => valid && onSave(form)}
          disabled={!valid || isSaving}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
