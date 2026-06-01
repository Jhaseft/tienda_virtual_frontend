import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Package } from "lucide-react"
import type { InventoryItem } from "@/types/admin"

interface Props {
  item: InventoryItem
}

const STOCK_META = {
  OK:  { label: "En stock",    color: "text-emerald-600", bg: "bg-emerald-50" },
  LOW: { label: "Stock bajo",  color: "text-amber-600",   bg: "bg-amber-50"   },
  OUT: { label: "Agotado",     color: "text-rose-600",    bg: "bg-rose-50"    },
}

export default function ProductListCard({ item }: Props) {
  const stock = STOCK_META[item.stockStatus]

  return (
    <Link
      href={`/products/${item.id}`}
      className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-all hover:border-violet-200 hover:shadow-md"
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
        ) : (
          <Package size={20} className="text-gray-300" strokeWidth={1.5} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-gray-800 truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
          <span>Stock: {item.stock}</span>
          <span className="text-gray-200">·</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-[16px] font-bold text-violet-600">Bs {item.price.toFixed(2)}</span>
      </div>

      <ChevronRight size={16} strokeWidth={2}
        className="shrink-0 text-gray-300 transition-colors group-hover:text-violet-400" />
    </Link>
  )
}
