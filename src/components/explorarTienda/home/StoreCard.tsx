import Image from "next/image"
import Link from "next/link"
import { Store } from "@/types/explorar"

interface Props {
  store: Store
}

export default function StoreCard({ store }: Props) {
  return (
    <Link
      href={`/tiendas/${store.id}`}
      className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-violet-100 group"
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
        {store.logoUrl ? (
          <Image
            src={store.logoUrl}
            alt={store.name}
            width={56}
            height={56}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <StorePlaceholder />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors truncate">
          {store.name}
        </p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{store.storeType}</p>
        {store.city && (
          <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-1">
            <PinIcon />
            {store.city}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
          <StarIcon />
          <span className="text-sm font-bold text-amber-600">
            {store.rating?.toFixed(1) ?? "—"}
          </span>
        </div>
        {store.totalReviews != null && (
          <span className="text-[10px] text-gray-400">{store.totalReviews} reseñas</span>
        )}
      </div>
    </Link>
  )
}

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#9ca3af" strokeWidth="2" fill="#9ca3af" fillOpacity="0.3" />
      <circle cx="12" cy="9" r="2.5" fill="#9ca3af" />
    </svg>
  )
}

function StorePlaceholder() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9l1-5h16l1 5" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" stroke="#d1d5db" strokeWidth="1.5" />
      <path d="M5 9v11h14V9" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
