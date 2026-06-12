import { MessageCircle } from "lucide-react"
import type { AdminOrder, AdminOrderItem } from "@/types/admin"

interface Props {
  address: NonNullable<AdminOrder["address"]>
  orderSeq: number
  items: AdminOrderItem[]
  total: number
}

function buildWhatsAppMessage(orderSeq: number, items: AdminOrderItem[], total: number): string {
  const productList = items
    .map((item) => {
      const extras = [item.size ? `talla ${item.size}` : null, item.colorName ? `color ${item.colorName}` : null]
        .filter(Boolean)
        .join(", ")
      return `• ${item.productName}${extras ? ` (${extras})` : ""} x${item.quantity} — Bs. ${(item.unitPrice * item.quantity).toFixed(2)}`
    })
    .join("\n")

  return (
    `Hola, le contactamos respecto a su *Pedido #${orderSeq}*.\n\n` +
    `📦 *Productos:*\n${productList}\n\n` +
    `💰 *Total: Bs. ${total.toFixed(2)}*\n\n`
  )
}

export default function AddressSection({ address, orderSeq, items, total }: Props) {
  const number = address.phone.replace(/\D/g, "")
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsAppMessage(orderSeq, items, total))}`

  return (
    <div className="px-5 py-4 border-t border-gray-100">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Enviar a</p>
      <p className="text-sm font-semibold text-gray-900 mb-1">{address.fullName}</p>
      <div className="space-y-0.5 mb-3">
        <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Calle</span> · {address.street}</p>
        <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Ciudad</span> · {address.city}</p>
        <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Dpto.</span> · {address.state}</p>
        <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Tel</span> · {address.phone}</p>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        Contactar al cliente
      </a>
    </div>
  )
}
