"use client"

import { useRef } from "react"
import Image from "next/image"
import { Camera, X, Loader2 } from "lucide-react"

export interface PhotoSlot {
  id?: string
  url: string
  file?: File
  uploading?: boolean
}

interface Props {
  photos: PhotoSlot[]
  onChange: (photos: PhotoSlot[]) => void
}

export default function ProductPhotoUploader({ photos, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    e.target.value = ""

    const toAdd = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      uploading: false,
    }))

    onChange([...photos, ...toAdd])
  }

  function remove(index: number) {
    onChange(photos.filter((_, i) => i !== index))
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm font-bold text-black uppercase tracking-wider mb-3">Fotos</p>

      <div className="grid grid-cols-5 gap-2">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
          >
            <Image src={photo.url} alt="" fill className="object-cover" />
            {photo.uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 size={16} className="text-white animate-spin" />
              </div>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X size={10} className="text-white" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-xl border-2 border-dashed border-violet-200 bg-violet-50 flex flex-col items-center justify-center gap-1 hover:border-violet-400 hover:bg-violet-100 transition-colors"
        >
          <Camera size={18} className="text-violet-400" />
          <span className="text-[10px] text-violet-400 font-semibold">Agregar</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </section>
  )
}
