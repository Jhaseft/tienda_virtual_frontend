import Image from "next/image"
import { StoreDetail } from "@/types/explorar"

interface Props {
  store: StoreDetail
}

export default function StoreHeader({ store }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-6">

      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-violet-100 shrink-0 shadow-md ring-4 ring-white">
        {store.logoUrl ? (
          <Image src={store.logoUrl} alt={store.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <StorePlaceholder />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            store.isOpen ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}>
            {store.isOpen ? "● Abierto" : "● Cerrado"}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1 flex-wrap text-sm text-gray-500">
          {store.storeType && <span>{store.storeType}</span>}
          {store.storeType && store.city && <span className="text-gray-300">·</span>}
          {store.city && (
            <span className="flex items-center gap-1">
              <PinIcon />
              {store.city}
            </span>
          )}
        </div>

      </div>
    </div>
  )
}

function StorePlaceholder() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9l1-5h16l1 5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" stroke="#7c3aed" strokeWidth="1.5" />
      <path d="M5 9v11h14V9" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#9ca3af" fillOpacity="0.4" stroke="#9ca3af" strokeWidth="1.5" />
      <circle cx="12" cy="9" r="2.5" fill="#9ca3af" />
    </svg>
  )
}
