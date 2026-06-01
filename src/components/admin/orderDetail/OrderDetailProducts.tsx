import type { AdminOrder } from "@/types/admin";

interface Props {
  order: AdminOrder;
}

export default function OrderDetailProducts({ order }: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Productos</p>
      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-[11px] font-bold text-violet-500">
              {item.productName.slice(0, 3).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{item.productName}</p>
              <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                {item.size && <span>Talla: {item.size}</span>}
                {item.colorName && <span>Color: {item.colorName}</span>}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-gray-900">Bs {item.unitPrice.toFixed(2)}</p>
              <p className="text-xs text-gray-400">x{item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 space-y-1.5">
        {order.subtotal > 0 && order.subtotal !== order.total && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-700">Bs {order.subtotal.toFixed(2)}</span>
          </div>
        )}
        {order.shippingCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Envío</span>
            <span className="text-gray-700">Bs {order.shippingCost.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-sm font-semibold text-gray-700">Total</span>
          <span className="text-base font-bold text-gray-900">Bs {order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
