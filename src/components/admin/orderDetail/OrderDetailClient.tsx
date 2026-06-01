import { MessageCircle, Mail } from "lucide-react";
import Image from "next/image";
import type { AdminOrder } from "@/types/admin";

interface Props {
  order: AdminOrder;
  whatsappHref: string | null;
}

function getInitials(firstName?: string | null, lastName?: string | null) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

export default function OrderDetailClient({ order, whatsappHref }: Props) {
  const { client } = order;
  const fullName = `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() || "Cliente";
  const initials = getInitials(client.firstName, client.lastName);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Cliente</p>

      <div className="flex items-center gap-4">
        <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden bg-violet-100 flex items-center justify-center text-sm font-bold text-violet-600">
          {client.avatarUrl ? (
            <Image src={client.avatarUrl} alt={fullName} width={48} height={48} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-gray-900 truncate">{fullName}</p>
          {(client.phoneNumber || client.email) && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail size={11} className="text-gray-400 shrink-0" strokeWidth={2} />
              <span className="text-sm text-violet-500 font-medium truncate">
                {client.email}
              </span>
            </div>
          )}
        </div>

        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold shadow-sm hover:bg-emerald-600 active:scale-95 transition-all shrink-0"
          >
            <MessageCircle size={16} strokeWidth={2} fill="currentColor" />
            <span className="hidden sm:inline">{client.phoneNumber}</span>
          </a>
        )}
      </div>
    </div>
  );
}
