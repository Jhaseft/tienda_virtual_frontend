"use client"

import { useState, useRef, useEffect } from "react"
import type { SocialNetwork, StoreSocialLink } from "@/types/admin"
import SocialIcon, { SOCIAL_NETWORK_LABELS } from "@/components/ui/SocialIcon"
import { SectionTitle, InlineField, SaveCancelRow } from "./SettingsUI"

const NETWORKS = Object.keys(SOCIAL_NETWORK_LABELS) as SocialNetwork[]

interface Props {
  links: StoreSocialLink[]
  isSaving: boolean
  onAdd: (network: SocialNetwork, url: string) => Promise<void>
  onUpdate: (id: string, network: SocialNetwork, url: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function NetworkSelect({ value, onChange }: { value: SocialNetwork; onChange: (v: SocialNetwork) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div className="flex flex-col gap-1" ref={ref}>
      <label className="text-xs font-medium text-gray-500">Red social</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-colors"
      >
        <span className="flex items-center gap-2">
          <SocialIcon network={value} size={18} />
          <span className="font-medium">{SOCIAL_NETWORK_LABELS[value]}</span>
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-56 rounded-2xl border border-gray-100 bg-white shadow-lg overflow-hidden">
          {NETWORKS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => { onChange(n); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-violet-50 ${n === value ? "bg-violet-50 text-violet-700 font-semibold" : "text-gray-700"}`}
            >
              <SocialIcon network={n} size={18} />
              {SOCIAL_NETWORK_LABELS[n]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export default function SettingsSocialSection({ links, isSaving, onAdd, onUpdate, onDelete }: Props) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newNetwork, setNewNetwork] = useState<SocialNetwork>("INSTAGRAM")
  const [newUrl, setNewUrl] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNetwork, setEditNetwork] = useState<SocialNetwork>("INSTAGRAM")
  const [editUrl, setEditUrl] = useState("")

  function openAdd() { setShowAddForm(true); setNewNetwork("INSTAGRAM"); setNewUrl(""); setEditingId(null) }
  function cancelAdd() { setShowAddForm(false); setNewUrl("") }

  function openEdit(link: StoreSocialLink) {
    setEditingId(link.id); setEditNetwork(link.network); setEditUrl(link.url); setShowAddForm(false)
  }
  function cancelEdit() { setEditingId(null) }

  async function handleAdd() {
    if (!newUrl.trim()) return
    await onAdd(newNetwork, newUrl.trim())
    cancelAdd()
  }

  async function handleUpdate() {
    if (!editingId || !editUrl.trim()) return
    await onUpdate(editingId, editNetwork, editUrl.trim())
    cancelEdit()
  }

  async function handleDelete(id: string) {
    await onDelete(id)
    if (editingId === id) cancelEdit()
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <SectionTitle>Redes sociales</SectionTitle>
        {!showAddForm && (
          <button
            onClick={openAdd}
            className="text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors"
          >
            + Agregar
          </button>
        )}
      </div>

      {links.length === 0 && !showAddForm && (
        <p className="text-sm text-gray-400 py-2">Sin redes sociales configuradas.</p>
      )}

      <div className="space-y-2">
        {links.map((link) => (
          <div key={link.id}>
            {editingId === link.id ? (
              <div className="relative rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3">
                <NetworkSelect value={editNetwork} onChange={setEditNetwork} />
                <InlineField label="Enlace" value={editUrl} onChange={setEditUrl} />
                <SaveCancelRow onSave={handleUpdate} onCancel={cancelEdit} isSaving={isSaving} />
              </div>
            ) : (
              <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <SocialIcon network={link.network} size={20} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{SOCIAL_NETWORK_LABELS[link.network]}</p>
                    <p className="text-xs text-gray-400 truncate max-w-50">{link.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => openEdit(link)}
                    className="text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="text-sm font-medium text-red-400 hover:text-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="relative rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3 mt-2">
          <NetworkSelect value={newNetwork} onChange={setNewNetwork} />
          <InlineField label="Enlace (ej: https://instagram.com/mitienda)" value={newUrl} onChange={setNewUrl} />
          <SaveCancelRow onSave={handleAdd} onCancel={cancelAdd} isSaving={isSaving} />
        </div>
      )}
    </div>
  )
}
