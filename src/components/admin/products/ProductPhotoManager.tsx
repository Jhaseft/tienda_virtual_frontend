"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Camera, Loader2, Trash2 } from "lucide-react"
import { uploadProductPhoto, deleteProductPhoto } from "@/lib/api/admin"

interface Photo { id: string; url: string; order: number }

interface Props {
  productId: string
  token: string
  photos: Photo[]
  onChange: (photos: Photo[]) => void
}

export default function ProductPhotoManager({ productId, token, photos, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    e.target.value = ""
    setUploading(true)
    for (const file of files) {
      try {
        const result = await uploadProductPhoto(file, productId, { token })
        onChange([...photos, result])
      } catch { /* continuar */ }
    }
    setUploading(false)
  }

  async function handleDelete(photo: Photo) {
    setDeletingId(photo.id)
    try {
      await deleteProductPhoto(photo.id, { token })
      onChange(photos.filter((p) => p.id !== photo.id))
    } catch { /* ignorar */ }
    setDeletingId(null)
  }

  return (
    <div className="mt-4">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fotos del producto</p>

      <div className="grid grid-cols-4 gap-2">
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100">
            <Image src={photo.url} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            <button
              type="button"
              onClick={() => handleDelete(photo)}
              disabled={deletingId === photo.id}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {deletingId === photo.id
                ? <Loader2 size={18} className="text-white animate-spin" />
                : <Trash2 size={18} className="text-white drop-shadow" />}
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="aspect-square rounded-xl border-2 border-dashed border-violet-200 bg-violet-50 flex flex-col items-center justify-center gap-1 hover:border-violet-400 hover:bg-violet-100 transition-colors disabled:opacity-60"
        >
          {uploading
            ? <Loader2 size={18} className="text-violet-400 animate-spin" />
            : <Camera size={18} className="text-violet-400" />}
          <span className="text-[9px] text-violet-400 font-semibold">
            {uploading ? "Subiendo..." : "Agregar"}
          </span>
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
    </div>
  )
}
