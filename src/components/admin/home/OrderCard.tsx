import Link from "next/link";
import { Banknote, QrCode, Wallet, Smartphone, Building2, CreditCard, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AdminOrder } from "@/types/admin";
import StatusBadge from "./StatusBadge";

const PAYMENT_META: Record<string, { label: string; Icon: LucideIcon; color: string }> = {
  EFECTIVO:      { label: "Efectivo",      Icon: Banknote,    color: "text-emerald-500" },
  QR:            { label: "QR",            Icon: QrCode,      color: "text-violet-500"  },
  YAPE:          { label: "Yape",          Icon: Wallet,      color: "text-purple-500"  },
  TIGO_MONEY:    { label: "Tigo Money",    Icon: Smartphone,  color: "text-blue-500"    },
  TRANSFERENCIA: { label: "Transferencia", Icon: Building2,   color: "text-gray-500"    },
};

interface Props {
  order: AdminOrder;
}

export default function OrderCard({ order }: Props) {
  const customerName =
    `${order.client.firstName ?? ""} ${order.client.lastName ?? ""}`.trim() || "Cliente";

  const initials = customerName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const date = new Date(order.createdAt);
  const dateStr = date.toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr = date.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });

  const itemCount = order.items.reduce((acc, i) => acc + i.quantity, 0);
  const payment = PAYMENT_META[order.paymentMethod] ?? { label: order.paymentMethod, Icon: CreditCard, color: "text-gray-400" };
  const PayIcon = payment.Icon;

  return (
    <Link
      href={`/orders/${order.id}`}
      className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-all hover:border-violet-200 hover:shadow-md"
    >
      {/* Avatar */}
      <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-violet-100 flex items-center justify-center text-sm font-bold text-violet-600">
        {order.client.avatarUrl ? (
          <img src={order.client.avatarUrl} alt={customerName} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>

      {/* Info principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[13px] font-bold text-gray-800">#{order.orderSeq}</span>
          <span className="text-gray-300">·</span>
          <span className="text-[13px] font-medium text-gray-700 truncate">{customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{dateStr} · {timeStr}</span>
          <span className="hidden sm:inline text-gray-200">·</span>
          <span className="hidden sm:inline">{itemCount} {itemCount === 1 ? "producto" : "productos"}</span>
          <span className="hidden sm:inline text-gray-200">·</span>
          <span className={`hidden sm:flex items-center gap-1 ${payment.color}`}>
            <PayIcon size={12} strokeWidth={2} />
            {payment.label}
          </span>
        </div>
      </div>

      {/* Total + badge */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <StatusBadge status={order.status} />
        <span className="text-sm font-bold text-gray-900">Bs {order.total.toFixed(2)}</span>
      </div>

      {/* Flecha */}
      <ChevronRight size={16} strokeWidth={2}
        className="shrink-0 text-gray-300 transition-colors group-hover:text-violet-400" />
    </Link>
  );
}
