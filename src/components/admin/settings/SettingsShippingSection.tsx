'use client'

import { useState } from "react"
import { SectionHeader } from "./SettingsUI"
import ZoneForm from "./SettingsShipping/ZoneForm"
import ZoneCard from "./SettingsShipping/ZoneCard"
import { EMPTY_FORM } from "./SettingsShipping/shippingZoneUtils"
import type { ShippingZone, CreateShippingZonePayload } from "@/types/shippingZone"

type Mode = 'normal' | 'adding' | 'deleting' | 'editing'

interface Props {
  zones: ShippingZone[]
  isSaving: boolean
  onCreate: (dto: CreateShippingZonePayload) => Promise<void>
  onUpdate: (id: string, dto: Partial<CreateShippingZonePayload & { isActive: boolean }>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function SettingsShippingSection({ zones, isSaving, onCreate, onUpdate, onDelete }: Props) {
  const [mode, setMode] = useState<Mode>('normal')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const cities = [...new Set(zones.map((z) => z.city))].sort()

  function cancel() {
    setMode('normal'); setSelectedIds(new Set()); setEditingId(null)
  }

  function toggleSelect(id: string) {
    if (mode === 'editing') { setEditingId(id); return }
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleConfirmDelete() {
    setConfirmingDelete(true)
    for (const id of selectedIds) await onDelete(id)
    setConfirmingDelete(false)
    cancel()
  }

  async function handleEditSave(dto: CreateShippingZonePayload) {
    if (!editingId) return
    await onUpdate(editingId, dto)
    cancel()
  }

  const cardMode = mode === 'deleting' ? 'deleting' : mode === 'editing' ? 'editing' : 'normal'

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <SectionHeader
        title="Zonas de envío"
        mode={mode}
        hasItems={zones.length > 0}
        confirmingDelete={confirmingDelete}
        selectedCount={selectedIds.size}
        onAdd={() => setMode('adding')}
        onEdit={() => setMode('editing')}
        onDelete={() => setMode('deleting')}
        onCancel={cancel}
        onConfirmDelete={handleConfirmDelete}
      />

      {mode === 'adding' && (
        <div className="mb-4">
          <ZoneForm
            initial={EMPTY_FORM}
            isSaving={isSaving}
            onSave={async (dto) => { await onCreate(dto); cancel() }}
            onCancel={cancel}
          />
        </div>
      )}

      {zones.length === 0 && mode !== 'adding' && (
        <p className="text-sm text-gray-400 text-center py-6">
          No tienes zonas de envío. Agrega una para que tus clientes puedan elegir.
        </p>
      )}

      {cities.length > 0 && (
        <div className="space-y-4">
          {cities.map((city) => (
            <div key={city}>
              <div className="space-y-2">
                {zones.filter((z) => z.city === city).map((zone) => (
                  <ZoneCard
                    key={zone.id}
                    zone={zone}
                    mode={cardMode}
                    selected={selectedIds.has(zone.id)}
                    isSaving={isSaving}
                    onToggleSelect={() => toggleSelect(zone.id)}
                    onUpdate={(dto) => onUpdate(zone.id, dto)}
                    onEditClick={() => setEditingId(zone.id)}
                    editingInline={editingId === zone.id}
                    onEditSave={handleEditSave}
                    onEditCancel={cancel}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
