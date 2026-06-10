'use client'

import { useState } from 'react'
import { createAddress, type Address } from '@/app/(explorarTienda)/api/addresses.api'

interface Props {
  token: string
  onCreated: (addr: Address) => void
  onCancel: () => void
}

const EMPTY = {
  fullName: '', phone: '', street: '', city: '',
  state: '', zipCode: '', country: 'Bolivia', isDefault: false,
}

export default function NewAddressInline({ token, onCreated, onCancel }: Props) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = 'Requerido'
    if (!form.phone.trim()) e.phone = 'Requerido'
    if (!form.street.trim()) e.street = 'Requerido'
    if (!form.city.trim()) e.city = 'Requerido'
    if (!form.state.trim()) e.state = 'Requerido'
    if (!form.country.trim()) e.country = 'Requerido'
    return e
  }

  const handleSave = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      const addr = await createAddress(token, {
        fullName: form.fullName,
        phone: form.phone,
        street: form.street,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode || null,
        country: form.country,
        isDefault: form.isDefault,
      })
      onCreated(addr)
    } catch {
      setErrors({ general: 'No se pudo guardar la dirección' })
    } finally {
      setSaving(false)
    }
  }

  const field = (
    label: string,
    key: string,
    opts?: { placeholder?: string; optional?: boolean; half?: boolean }
  ) => (
    <div className={opts?.half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label} {opts?.optional && <span className="text-gray-400">(opcional)</span>}
      </label>
      <input
        value={form[key as keyof typeof form] as string}
        onChange={(e) => set(key, e.target.value)}
        placeholder={opts?.placeholder ?? label}
        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition ${
          errors[key] ? 'border-red-400' : 'border-gray-300'
        }`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-0.5">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="mt-4 bg-gray-50 rounded-xl border border-gray-200 p-5">
      <div className="grid grid-cols-2 gap-3">
        {field('Nombre completo', 'fullName')}
        {field('Teléfono', 'phone', { half: true })}
        {field('País', 'country', { half: true })}
        {field('Calle / Número', 'street')}
        {field('Ciudad', 'city', { half: true })}
        {field('Departamento', 'state', { half: true })}
        {field('Código postal', 'zipCode', { optional: true, half: true })}
      </div>

      <label className="flex items-center gap-2 mt-4 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => set('isDefault', e.target.checked)}
          className="accent-blue-600 w-4 h-4"
        />
        <span className="text-sm text-gray-700">Guardar como dirección principal</span>
      </label>

      {errors.general && (
        <p className="text-sm text-red-500 mt-2">{errors.general}</p>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition disabled:opacity-60"
        >
          {saving ? 'Guardando...' : 'Agregar'}
        </button>
        <button
          onClick={onCancel}
          className="border border-gray-300 text-sm text-gray-700 px-5 py-2 rounded-full hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
