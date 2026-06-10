'use client'

import { useState } from 'react'
import type { Address } from '@/app/(explorarTienda)/api/addresses.api'
import { updateAddress } from '@/app/(explorarTienda)/api/addresses.api'

interface Props {
  address: Address
  token: string
  onSaved: (addr: Address) => void
  onCancel: () => void
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  half?: boolean
}

function FormField({ label, value, onChange, half = false }: FieldProps) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition"
      />
    </div>
  )
}

export default function EditAddressInline({ address, token, onSaved, onCancel }: Props) {
  const [form, setForm] = useState({
    fullName: address.fullName,
    phone: address.phone,
    street: address.street,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode ?? '',
    country: address.country,
    isDefault: address.isDefault,
  })
  const [saving, setSaving] = useState(false)

  const set = (field: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await updateAddress(token, address.id, {
        ...form,
        zipCode: form.zipCode || null,
      })
      onSaved(updated)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
      <div className="grid grid-cols-2 gap-2">
        <FormField label="Nombre completo" value={form.fullName} onChange={(v) => set('fullName', v)} />
        <FormField label="Teléfono" value={form.phone} onChange={(v) => set('phone', v)} half />
        <FormField label="País" value={form.country} onChange={(v) => set('country', v)} half />
        <FormField label="Calle / Número" value={form.street} onChange={(v) => set('street', v)} />
        <FormField label="Ciudad" value={form.city} onChange={(v) => set('city', v)} half />
        <FormField label="Departamento" value={form.state} onChange={(v) => set('state', v)} half />
        <FormField label="Código postal" value={form.zipCode} onChange={(v) => set('zipCode', v)} half />
      </div>

      <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => set('isDefault', e.target.checked)}
          className="accent-blue-600 w-4 h-4"
        />
        <span className="text-xs text-gray-600">Dirección predeterminada</span>
      </label>

      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition disabled:opacity-60"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button
          onClick={onCancel}
          className="border border-gray-300 text-xs text-gray-600 px-4 py-2 rounded-full hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
