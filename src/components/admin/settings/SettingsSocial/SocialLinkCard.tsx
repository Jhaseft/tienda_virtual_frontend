"use client"

import { Check } from "lucide-react"
import type { SocialNetwork, StoreSocialLink } from "@/types/admin"
import SocialIcon, { SOCIAL_NETWORK_LABELS } from "@/components/ui/SocialIcon"
import SocialLinkForm from "./SocialLinkForm"

export type SocialCardMode = 'normal' | 'deleting' | 'editing'

interface Props {
  link: StoreSocialLink
  mode: SocialCardMode
  selected: boolean
  isEditingInline: boolean
  isSaving: boolean
  onToggleSelect: () => void
  onEditSave: (network: SocialNetwork, url: string) => Promise<void>
  onEditCancel: () => void
}

export default function SocialLinkCard({ link, mode, selected, isEditingInline, isSaving, onToggleSelect, onEditSave, onEditCancel }: Props) {
  const isDeleting = mode === 'deleting'
  const isEditing  = mode === 'editing'

  if (isEditingInline) {
    return (
      <SocialLinkForm
        initialNetwork={link.network}
        initialUrl={link.url}
        isSaving={isSaving}
        onSave={onEditSave}
        onCancel={onEditCancel}
      />
    )
  }

  const cardColor = isDeleting && selected
    ? 'bg-red-50 border border-red-200 rounded-xl'
    : isDeleting
    ? 'border border-dashed border-gray-200 rounded-xl hover:border-red-300'
    : isEditing
    ? 'border border-violet-200 rounded-xl hover:border-violet-400 cursor-pointer'
    : 'border-b border-gray-50 last:border-0'

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-150 ${cardColor}`}
      onClick={(isDeleting || isEditing) ? onToggleSelect : undefined}
    >
      {isDeleting && (
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          selected ? 'bg-red-500 border-red-500' : 'border-gray-300'
        }`}>
          {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
      )}

      <SocialIcon network={link.network} size={20} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{SOCIAL_NETWORK_LABELS[link.network]}</p>
        <p className="text-xs text-gray-400 truncate">{link.url}</p>
      </div>
    </div>
  )
}
