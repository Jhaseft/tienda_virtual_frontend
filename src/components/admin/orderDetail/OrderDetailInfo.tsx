import { Calendar, MapPin, StickyNote, Banknote, QrCode, Wallet, Smartphone, Building2, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AdminOrder } from "@/types/admin";

const PAYMENT_META: Record<string, { label: string; Icon: LucideIcon; color: string }> = {
  EFECTIVO:      { label: "Efectivo",      Icon: Banknote,   color: "text-emerald-600" },
  QR:            { label: "QR",            Icon: QrCode,     color: "text-violet-600"  },
  YAPE:          { label: "Yape",          Icon: Wallet,     color: "text-purple-600"  },
  TIGO_MONEY:    { label: "Tigo Money",    Icon: Smartphone, color: "text-blue-600"    },
  TRANSFERENCIA: { label: "Transferencia", Icon: Building2,  color: "text-gray-600"    },
};

interface Props {
  order: AdminOrder;
}

export default function OrderDetailInfo({ order }: Props) {
  const payment = PAYMENT_META[order.paymentMethod] ?? {
    label: order.paymentMethod,
    Icon: CreditCard,
    color: "text-gray-600",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Información</p>
      <InfoRow
        icon={<Calendar size={14} className="text-gray-400" />}
        label="Fecha"
        value={new Date(order.createdAt).toLocaleString("es-BO")}
      />
      <InfoRow
        icon={<payment.Icon size={14} className={payment.color} />}
        label="Método de pago"
        value={payment.label}
        valueClass={payment.color}
      />
      {order.deliveryAddress && (
        <InfoRow
          icon={<MapPin size={14} className="text-gray-400" />}
          label="Dirección"
          value={order.deliveryAddress}
        />
      )}
      {order.notes && (
        <InfoRow
          icon={<StickyNote size={14} className="text-gray-400" />}
          label="Notas"
          value={order.notes}
        />
      )}
    </div>
  );
}

function InfoRow({
  icon, label, value, valueClass = "text-gray-800",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-500 shrink-0">
        {icon}
        {label}
      </div>
      <p className={`text-sm font-medium text-right ${valueClass}`}>{value}</p>
    </div>
  );
}
