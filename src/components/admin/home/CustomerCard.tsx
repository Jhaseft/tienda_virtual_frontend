import Image from "next/image";
import { MessageCircle, ShoppingBag, Clock } from "lucide-react";
import type { AdminCustomer } from "@/types/admin";

interface Props {
  customer: AdminCustomer;
}

function buildWhatsAppHref(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}`;
}

function formatLastOrder(date: string | Date | null | undefined): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-600",
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-sky-100 text-sky-600",
];

function getAvatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default function CustomerCard({ customer }: Props) {
  const lastOrder = formatLastOrder(customer.lastOrderAt);
  const initials = getInitials(customer.name);
  const avatarColor = getAvatarColor(customer.name);

  return (
    <article className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-all hover:border-violet-200 hover:shadow-md">
      <div className={`h-10 w-10 shrink-0 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold ${avatarColor}`}>
        {customer.avatarUrl ? (
          <Image src={customer.avatarUrl} alt={customer.name} width={40} height={40} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-[13px] font-bold text-gray-800 truncate">{customer.name}</p>
          <span className="text-xs text-violet-500 font-medium shrink-0">
            {customer.phoneNumber || customer.email || ""}
          </span>
        </div>
        {lastOrder && (
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400">
            <Clock size={10} strokeWidth={2} />
            <span>Último pedido: {lastOrder}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="shrink-0 flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <ShoppingBag size={11} strokeWidth={2} />
          <span>{customer.totalOrders} {customer.totalOrders === 1 ? "pedido" : "pedidos"}</span>
        </div>
        <p className="text-sm font-bold text-gray-900">Bs {customer.totalSpent.toFixed(2)}</p>
      </div>

      {/* WhatsApp */}
      {customer.phoneNumber ? (
        <a
          href={buildWhatsAppHref(customer.phoneNumber)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Contactar a ${customer.name} por WhatsApp`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 transition-all shadow-sm"
        >
          <MessageCircle size={16} strokeWidth={2} fill="currentColor" />
        </a>
      ) : (
        <div className="w-9" />
      )}
    </article>
  );
}
