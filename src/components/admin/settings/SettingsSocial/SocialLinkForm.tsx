"use client"

import { useState } from "react"
import type { SocialNetwork } from "@/types/admin"
import NetworkSelect from "./NetworkSelect"
import { InlineField, SaveCancelRow } from "../SettingsUI"

interface Props {
  initialNetwork?: SocialNetwork
  initialUrl?: string
  isSaving: boolean
  onSave: (network: SocialNetwork, url: string) => Promise<void>
  onCancel: () => void
}

export default function SocialLinkForm({ initialNetwork = "INSTAGRAM", initialUrl = "", isSaving, onSave, onCancel }: Props) {
  const [network, setNetwork] = useState<SocialNetwork>(initialNetwork)
  const [url, setUrl] = useState(initialUrl)

  async function handleSave() {
    if (!url.trim()) return
    await onSave(network, url.trim())
  }

  return (
    <div className="relative rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3">
      <NetworkSelect value={network} onChange={setNetwork} />
      <InlineField label="Enlace (ej: https://instagram.com/mitienda)" value={url} onChange={setUrl} />
      <SaveCancelRow onSave={handleSave} onCancel={onCancel} isSaving={isSaving} />
    </div>
  )
}
