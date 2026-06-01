import Link from "next/link";
import type { AdminOrder } from "@/types/admin";
import StatusBadge from "./StatusBadge";

interface Props {
  order: AdminOrder;
}

export default function OrderCard({ order }: Props) {
  const customerName =
    `${order.client.firstName ?? ""} ${order.client.lastName ?? ""}`.trim() ||
    "Cliente";

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-violet-300"
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-900">#{order.orderSeq}</p>
        <StatusBadge status={order.status} />
      </div>
      <p className="text-sm text-zinc-700">{customerName}</p>
      <div className="mt-1 flex items-center justify-between text-xs text-zinc-500">
        <span>{new Date(order.createdAt).toLocaleString()}</span>
        <span className="font-semibold text-zinc-800">Bs {order.total.toFixed(2)}</span>
      </div>
    </Link>
  );
}
