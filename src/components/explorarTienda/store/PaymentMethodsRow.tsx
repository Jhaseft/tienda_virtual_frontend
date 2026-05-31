import { PaymentMethod } from "@/types/explorar"
import PaymentMethodBadge from "./PaymentMethodBadge"

interface Props {
  methods: PaymentMethod[]
}

export default function PaymentMethodsRow({ methods }: Props) {
  if (methods.length === 0) return null

  const preview = methods.slice(0, 4)
  const hasMore = methods.length > 4

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-gray-900">Métodos de pago</h2>
        {hasMore && (
          <button className="text-xs text-violet-600 font-medium hover:text-violet-700">
            Ver todos
          </button>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {preview.map(m => (
          <PaymentMethodBadge key={m.id} type={m.type} />
        ))}
      </div>
    </section>
  )
}
