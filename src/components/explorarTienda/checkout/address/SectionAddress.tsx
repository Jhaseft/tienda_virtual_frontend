'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import type { Address } from '@/app/(explorarTienda)/api/addresses.api'
import { deleteAddress } from '@/app/(explorarTienda)/api/addresses.api'
import AddressCard from './AddressCard'
import NewAddressInline from './NewAddressInline'

type Mode = 'normal' | 'adding' | 'deleting' | 'editing'

interface Props {
  addresses: Address[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAddressCreated: (addr: Address) => void
  token: string
}

export default function SectionAddress({ addresses, selectedId, onSelect, onAddressCreated, token }: Props) {
  const [list, setList] = useState<Address[]>(addresses)
  const [expanded, setExpanded] = useState(addresses.length === 0)
  const [mode, setMode] = useState<Mode>('normal')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  const selected = list.find((a) => a.id === selectedId)

  function cancel() {
    setMode('normal')
    setSelectedIds(new Set())
    setEditingId(null)
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
    setConfirming(true)
    for (const id of selectedIds) {
      await deleteAddress(token, id)
      setList((prev) => prev.filter((a) => a.id !== id))
      if (selectedId === id) onSelect(list.find((a) => a.id !== id)?.id ?? '')
    }
    setConfirming(false)
    cancel()
  }

  function handleEdited(updated: Address) {
    setList((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    cancel()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap">Enviar a</h2>

        {!expanded && selected && mode === 'normal' && (
          <button onClick={() => setExpanded(true)} className="text-sm text-blue-600 hover:underline shrink-0">
            Cambiar
          </button>
        )}

        {expanded && mode === 'normal' && list.length > 0 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMode('adding')}
              className="h-8 w-8 sm:w-auto sm:px-3 flex items-center justify-center sm:gap-1.5 rounded-xl border border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600 text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Agregar</span>
            </button>
            <button
              onClick={() => setMode('editing')}
              className="h-8 w-8 sm:w-auto sm:px-3 flex items-center justify-center sm:gap-1.5 rounded-xl border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 text-xs font-medium transition-colors"
            >
              <Pencil className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Editar</span>
            </button>
            <button
              onClick={() => setMode('deleting')}
              className="h-8 w-8 sm:w-auto sm:px-3 flex items-center justify-center sm:gap-1.5 rounded-xl border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          </div>
        )}

        {expanded && mode !== 'normal' && (
          <button
            onClick={cancel}
            className="h-8 w-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Banner deleting */}
      {mode === 'deleting' && (
        <div className="px-6 py-2.5 bg-red-50 border-b border-red-100 flex items-center justify-between gap-3">
          <p className="text-xs text-red-600 font-medium">
            {selectedIds.size === 0 ? 'Toca las direcciones que quieres eliminar' : `${selectedIds.size} seleccionada${selectedIds.size > 1 ? 's' : ''}`}
          </p>
          {selectedIds.size > 0 && (
            <button
              onClick={handleConfirmDelete}
              disabled={confirming}
              className="flex items-center gap-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <Check className="w-3 h-3" />
              {confirming ? 'Eliminando...' : 'Confirmar'}
            </button>
          )}
        </div>
      )}

      {/* Banner editing */}
      {mode === 'editing' && !editingId && (
        <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-100">
          <p className="text-xs text-blue-600 font-medium">Toca la dirección que quieres editar</p>
        </div>
      )}

      {/* Vista colapsada: solo muestra la dirección seleccionada */}
      {!expanded && selected && (
        <div className="px-6 py-4 text-sm space-y-0.5">
          <p className="font-semibold text-gray-900">{selected.fullName}</p>
          <p className="text-gray-500"><span className="font-medium text-gray-700">Calle</span> · {selected.street}</p>
          <p className="text-gray-500"><span className="font-medium text-gray-700">Ciudad</span> · {selected.city}</p>
          <p className="text-gray-500"><span className="font-medium text-gray-700">Tel</span> · {selected.phone}</p>
        </div>
      )}

      {/* Lista expandida */}
      {expanded && (
        <div className="px-6 py-3 flex flex-col gap-1">
          {list.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isSelected={selectedId === addr.id}
              mode={mode}
              isChecked={selectedIds.has(addr.id)}
              isEditingInline={editingId === addr.id}
              token={token}
              onSelect={() => {
                if (mode !== 'normal') { toggleSelect(addr.id); return }
                onSelect(addr.id)
                setExpanded(false)
              }}
              onToggle={() => toggleSelect(addr.id)}
              onEdited={handleEdited}
              onCancelEdit={cancel}
            />
          ))}

          {mode === 'normal' && !list.length && (
            <p className="text-sm text-gray-400 py-2">No tienes direcciones guardadas.</p>
          )}

          {mode === 'adding' && (
            <div className="mt-1">
              <NewAddressInline
                token={token}
                onCreated={(addr) => {
                  setList((prev) => [...prev, addr])
                  onAddressCreated(addr)
                  setExpanded(false)
                  cancel()
                }}
                onCancel={cancel}
              />
            </div>
          )}

          {mode === 'normal' && (
            <button
              onClick={() => setMode('adding')}
              className="mt-1 text-sm text-blue-600 hover:underline text-left py-1"
            >
              + Agregar nueva dirección
            </button>
          )}
        </div>
      )}

      {!expanded && !selected && (
        <div className="px-6 py-4">
          <button
            onClick={() => { setExpanded(true); setMode('adding') }}
            className="text-sm text-blue-600 hover:underline"
          >
            + Agregar dirección de entrega
          </button>
        </div>
      )}
    </div>
  )
}
