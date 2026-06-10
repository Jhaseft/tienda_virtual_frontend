import Image from 'next/image'

interface Item {
  id: string
  quantity: number
  unitPrice: number
  size: string | null
  colorName: string | null
  product: {
    id: string
    name: string
    photos: { url: string }[]
  }
}

interface Props {
  items: Item[]
}

export default function ItemsList({ items }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-[16px] font-bold text-gray-800 mb-4">
        Productos ({items.length})
      </h2>
      <div className="flex flex-col divide-y divide-gray-50">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

function ItemRow({ item }: { item: Item }) {
  return (
    <div className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        {item.product.photos[0] ? (
          <Image
            src={item.product.photos[0].url}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImagePlaceholder />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {item.product.name}
        </p>
        <div className="flex gap-3 flex-wrap mt-0.5">
          {item.size && (
            <span className="text-xs text-gray-400">
              Variante: <span className="font-medium text-gray-600">{item.size}</span>
            </span>
          )}
          {item.colorName && (
            <span className="text-xs text-gray-400">
              Color: <span className="font-medium text-gray-600">{item.colorName}</span>
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          Bs {item.unitPrice.toFixed(2)} × {item.quantity}
        </p>
      </div>

      <p className="text-sm font-bold text-gray-800 shrink-0">
        Bs {(item.unitPrice * item.quantity).toFixed(2)}
      </p>
    </div>
  )
}

function ImagePlaceholder() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#D1D5DB" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB" />
      <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
