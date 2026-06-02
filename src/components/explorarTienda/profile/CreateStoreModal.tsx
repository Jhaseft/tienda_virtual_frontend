"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Camera, Check, Loader2, Store, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { apiRequest } from "@/lib/api/client"

interface Props {
  onClose: () => void
  onCreated: () => void
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition placeholder:text-gray-400"

export default function CreateStoreModal({ onClose, onCreated }: Props) {
  const { data: session, update } = useSession()
  const token = session?.user.backendToken
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
    e.target.value = ""
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    if (!name.trim()) return setError("El nombre de la tienda es obligatorio.")
    if (!whatsapp.trim()) return setError("El número de contacto es obligatorio.")

    setSaving(true)
    setError(null)

    try {
      // 1. Crear tienda primero
      await apiRequest("/stores", {
        method: "POST",
        token,
        body: {
          name: name.trim(),
          whatsapp: whatsapp.trim(),
          description: description.trim() || undefined,
          address: address.trim() || undefined,
        },
      })

      // 2. Subir logo (ahora la tienda ya existe)
      if (logoFile) {
        setUploading(true)
        const fd = new FormData()
        fd.append("file", logoFile)
        fd.append("type", "logo")
        await apiRequest("/uploads/store-image", {
          method: "POST",
          token,
          body: fd,
        })
        setUploading(false)
      }

      // Actualizar el rol en la sesión de NextAuth
      await update({ role: 'VENDOR' })

      setSuccess(true)
      setTimeout(() => onCreated(), 1800)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo crear la tienda.")
      setUploading(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-6">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
              <Store size={18} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Crear mi tienda</h2>
              <p className="text-xs text-gray-400">Configura tu tienda en minutos</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-14 px-6 gap-4 text-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check size={28} className="text-emerald-600" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">¡Tienda creada!</h3>
              <p className="text-sm text-gray-400 mt-1">Tu tienda ya está lista. Redirigiendo...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">

            {/* Logo */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-violet-200 bg-violet-50 flex flex-col items-center justify-center gap-1 hover:border-violet-400 transition-colors group"
              >
                {logoPreview ? (
                  <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                ) : (
                  <>
                    <Camera size={22} className="text-violet-400 group-hover:text-violet-600 transition-colors" />
                    <span className="text-[10px] text-violet-400 font-semibold">Foto de portada</span>
                  </>
                )}
              </button>
              {logoPreview && (
                <button type="button" onClick={() => { setLogoPreview(null); setLogoFile(null) }}
                  className="text-xs text-gray-400 hover:text-rose-500 transition-colors">
                  Quitar foto
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoSelect} />
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Nombre de la tienda <span className="text-rose-400">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Moda Linda, TechStore..."
                className={inputClass}
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Número de contacto <span className="text-rose-400">*</span>
              </label>
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ej: 591 70000000"
                className={inputClass}
              />
              <p className="text-[11px] text-gray-400 mt-1">Este número se usará para WhatsApp y contacto con clientes</p>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cuéntanos qué vende tu tienda..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Dirección</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: Av. 16 de Julio, La Paz"
                className={inputClass}
              />
            </div>

            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold py-3.5 text-sm transition-all shadow-lg shadow-violet-200 disabled:opacity-60"
            >
              {saving
                ? <><Loader2 size={16} className="animate-spin" /> {uploading ? "Subiendo foto..." : "Creando tienda..."}</>
                : <><Store size={16} /> Crear mi tienda</>}
            </button>

          </form>
        )}
      </div>
    </div>
  )
}
