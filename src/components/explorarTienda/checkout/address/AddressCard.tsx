'use client'

import { Check } from 'lucide-react'
import type { Address } from '@/app/(explorarTienda)/api/addresses.api'
import EditAddressInline from './EditAddressInline'

type Mode = 'normal' | 'adding' | 'deleting' | 'editing'

interface Props {
  address: Address
  isSelected: boolean
  mode: Mode
  isChecked: boolean
  isEditingInline: boolean
  token: string
  onSelect: () => void
  onToggle: () => void
  onEdited: (addr: Address) => void
  onCancelEdit: () => void
}

export default function AddressCard({
  address, isSelected, mode, isChecked, isEditingInline,
  token, onSelect, onToggle, onEdited, onCancelEdit,
}: Props) {
  if (isEditingInline) {
    return (
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
        <EditAddressInline
          address={address}
          token={token}
          onSaved={onEdited}
          onCancel={onCancelEdit}
        />
      </div>
    )
  }

  const isDeleting = mode === 'deleting'
  const isEditing  = mode === 'editing'

  const cardClass = isDeleting && isChecked
    ? 'border border-red-300 bg-red-50'
    : isDeleting
    ? 'border border-dashed border-gray-200 bg-white hover:border-red-300'
    : isEditing
    ? 'border border-blue-200 bg-white hover:border-blue-400 hover:shadow-sm cursor-pointer'
    : 'border border-gray-100 bg-white hover:border-gray-300 cursor-pointer'

  function handleClick() {
    if (isDeleting || isEditing) { onToggle(); return }
    onSelect()
  }

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-2xl transition-all duration-150 ${cardClass}`}
      onClick={handleClick}
    >
      {isDeleting ? (
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
          isChecked ? 'bg-red-500 border-red-500' : 'border-gray-300'
        }`}>
          {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
      ) : (
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
          isSelected && !isEditing ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
        }`}>
          {isSelected && !isEditing && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      )}

      <div className="flex-1 min-w-0 text-sm space-y-0.5">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900">{address.fullName}</p>
          {address.isDefault && (
            <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
              Predeterminada
            </span>
          )}
        </div>
        <div className="mt-0.5 space-y-0.5">
          <p className="text-gray-500"><span className="font-medium text-gray-700">Calle</span> · {address.street}</p>
          <p className="text-gray-500"><span className="font-medium text-gray-700">Ciudad</span> · {address.city}</p>
          <p className="text-gray-500"><span className="font-medium text-gray-700">Dpto.</span> · {address.state}</p>
          <p className="text-gray-500"><span className="font-medium text-gray-700">Tel</span> · {address.phone}</p>
        </div>
      </div>
    </div>
  )
}
