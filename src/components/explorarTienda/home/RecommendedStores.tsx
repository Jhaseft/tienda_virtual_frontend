import Link from "next/link"
import StoreCard from "./StoreCard"
import { Store } from "@/types/explorar"

interface Props {
  stores: Store[]
  showAll?: boolean
}

export default function RecommendedStores({ stores, showAll = false }: Props) {
  const visible = showAll ? stores : stores.slice(0, 5)

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        {!showAll && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900">Tiendas recomendadas</h2>
        </div>
      )}
        {!showAll && (
          <Link href="/tiendas" className="text-sm text-violet-600 font-medium hover:text-violet-700 transition-colors">
            Ver todas →
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {visible.map(store => (
          <StoreCard key={store.id} store={store} />
        ))}
        {stores.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No hay tiendas disponibles.</p>
        )}
      </div>
    </section>
  )
}
