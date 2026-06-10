"use client"

import { useState, type ChangeEvent } from "react"
import type { StorePaymentMethod, UpdatePaymentMethodPayload } from "@/types/admin"
import { SectionHeader } from "./SettingsUI"
import PaymentMethodCard from "./SettingsPayment/PaymentMethodCard"
import PaymentMethodForm from "./SettingsPayment/PaymentMethodForm"

type Mode = "normal" | "adding" | "deleting" | "editing"

interface Props {
  methods: StorePaymentMethod[]
  isSaving: boolean
  onCreate: (dto: UpdatePaymentMethodPayload) => Promise<void>
  onUpdate: (id: string, dto: UpdatePaymentMethodPayload) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onUploadQr: (e: ChangeEvent<HTMLInputElement>, onChange: (url: string, id: string) => void) => void
}

export default function SettingsPaymentSection({ methods, isSaving, onCreate, onUpdate, onDelete, onUploadQr }: Props) {
  const [mode, setMode] = useState<Mode>("normal")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  function cancel() {
    setMode("normal")
    setSelectedIds(new Set())
    setEditingId(null)
  }

  function toggleSelect(id: string) {
    if (mode === "editing") { setEditingId(id); return }
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

  const cardMode = mode === "deleting" ? "deleting" : mode === "editing" ? "editing" : "normal"

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <SectionHeader
        title="Métodos de pago"
        mode={mode}
        hasItems={methods.length > 0}
        confirmingDelete={confirmingDelete}
        selectedCount={selectedIds.size}
        onAdd={() => setMode("adding")}
        onEdit={() => setMode("editing")}
        onDelete={() => setMode("deleting")}
        onCancel={cancel}
        onConfirmDelete={handleConfirmDelete}
      />

      {methods.length === 0 && mode !== "adding" && (
        <p className="text-sm text-gray-400 text-center py-6">
          No tienes métodos de pago. Agrega uno para recibir pagos.
        </p>
      )}

      <div className="space-y-2">
        {methods.map((m) => (
          <PaymentMethodCard
            key={m.id}
            method={m}
            mode={cardMode}
            selected={selectedIds.has(m.id)}
            isEditingInline={editingId === m.id}
            isSaving={isSaving}
            onToggleSelect={() => toggleSelect(m.id)}
            onEditSave={async (dto) => { await onUpdate(m.id, dto); cancel() }}
            onEditCancel={cancel}
            onUploadQr={onUploadQr}
          />
        ))}
      </div>

      {mode === "adding" && (
        <div className="mt-3">
          <PaymentMethodForm
            isSaving={isSaving}
            disabledTypes={methods.map((m) => m.type as import("./SettingsPayment/paymentConfig").PaymentType)}
            onSave={async (dto) => { await onCreate(dto); cancel() }}
            onCancel={cancel}
            onUploadQr={onUploadQr}
          />
        </div>
      )}

    </div>
  )
}
