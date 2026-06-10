"use client"

import { useState } from "react"
import type { SocialNetwork, StoreSocialLink } from "@/types/admin"
import { SectionHeader } from "./SettingsUI"
import SocialLinkCard from "./SettingsSocial/SocialLinkCard"
import SocialLinkForm from "./SettingsSocial/SocialLinkForm"

type Mode = 'normal' | 'adding' | 'deleting' | 'editing'

interface Props {
  links: StoreSocialLink[]
  isSaving: boolean
  onAdd: (network: SocialNetwork, url: string) => Promise<void>
  onUpdate: (id: string, network: SocialNetwork, url: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function SettingsSocialSection({ links, isSaving, onAdd, onUpdate, onDelete }: Props) {
  const [mode, setMode] = useState<Mode>('normal')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

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

  const cardMode = mode === 'deleting' ? 'deleting' : mode === 'editing' ? 'editing' : 'normal'

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <SectionHeader
        title="Redes sociales"
        mode={mode}
        hasItems={links.length > 0}
        confirmingDelete={confirmingDelete}
        selectedCount={selectedIds.size}
        onAdd={() => setMode('adding')}
        onEdit={() => setMode('editing')}
        onDelete={() => setMode('deleting')}
        onCancel={cancel}
        onConfirmDelete={handleConfirmDelete}
      />

      {links.length === 0 && mode !== 'adding' && (
        <p className="text-sm text-gray-400 py-2">Sin redes sociales configuradas.</p>
      )}

      <div className="space-y-1.5">
        {links.map((link) => (
          <SocialLinkCard
            key={link.id}
            link={link}
            mode={cardMode}
            selected={selectedIds.has(link.id)}
            isEditingInline={editingId === link.id}
            isSaving={isSaving}
            onToggleSelect={() => toggleSelect(link.id)}
            onEditSave={async (network, url) => { await onUpdate(link.id, network, url); cancel() }}
            onEditCancel={cancel}
          />
        ))}
      </div>

      {mode === 'adding' && (
        <div className="mt-2">
          <SocialLinkForm
            isSaving={isSaving}
            onSave={async (network, url) => { await onAdd(network, url); cancel() }}
            onCancel={cancel}
          />
        </div>
      )}
    </div>
  )
}
