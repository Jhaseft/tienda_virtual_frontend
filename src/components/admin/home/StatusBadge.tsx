import type { AdminOrderStatus, StockStatus } from "@/types/admin";

type StatusValue = AdminOrderStatus | StockStatus;

interface Props {
  status: StatusValue;
}

const STATUS_META: Record<StatusValue, { label: string; className: string }> = {
  PENDING: { label: "Pendiente", className: "bg-amber-100 text-amber-700" },
  CONFIRMED: { label: "Confirmado", className: "bg-blue-100 text-blue-700" },
  PAID: { label: "Pagado", className: "bg-emerald-100 text-emerald-700" },
  SHIPPED: { label: "Enviado", className: "bg-sky-100 text-sky-700" },
  DELIVERED: { label: "Entregado", className: "bg-lime-100 text-lime-700" },
  CANCELLED: { label: "Cancelado", className: "bg-rose-100 text-rose-700" },
  OK: { label: "Stock suficiente", className: "bg-emerald-100 text-emerald-700" },
  LOW: { label: "Stock bajo", className: "bg-amber-100 text-amber-700" },
  OUT: { label: "Sin stock", className: "bg-rose-100 text-rose-700" },
};

export default function StatusBadge({ status }: Props) {
  const meta = STATUS_META[status];

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${meta.className}`}>
      {meta.label}
    </span>
  );
}
