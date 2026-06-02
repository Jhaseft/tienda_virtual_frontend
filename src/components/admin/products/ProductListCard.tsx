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
      className={`group flex items-center gap-4 rounded-2xl border px-5 py-4 shadow-sm transition-all ${
        item.isVisible
          ? "bg-white border-gray-100 hover:border-violet-200 hover:shadow-md"
          : "bg-gray-50 border-dashed border-gray-300 opacity-80 hover:opacity-100 hover:border-gray-400"
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center ${item.isVisible ? "bg-gray-100" : "bg-gray-200"}`}>
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} width={48} height={48} className={`w-full h-full object-cover ${!item.isVisible ? "grayscale" : ""}`} />
        ) : (
          <Package size={20} className="text-gray-300" strokeWidth={1.5} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-[13px] font-bold truncate ${item.isVisible ? "text-gray-800" : "text-gray-500"}`}>{item.name}</p>
          {!item.isVisible && (
            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              No publicado
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-gray-400">Stock: {item.stock}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className={`text-[16px] font-bold ${item.isVisible ? "text-violet-600" : "text-gray-400"}`}>Bs {item.price.toFixed(2)}</span>
      </div>

      <ChevronRight size={16} strokeWidth={2}
        className="shrink-0 text-gray-300 transition-colors group-hover:text-violet-400" />
    </Link>
  )
}
