"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Package, Crown, ShoppingBag, MoreHorizontal, Plus, BarChart2, Store, X, Layers, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useChatUnread } from "@/hooks/useChatUnread";

const LEFT_ITEMS = [
  { href: "/dashboard", label: "Inicio", Icon: Home },
  { href: "/products", label: "Productos", Icon: Package },
];

const RIGHT_ITEMS = [
  { href: "/orders", label: "Pedidos", Icon: ShoppingBag },
];

const MORE_ITEMS = [
  { href: "/planes",    label: "Planes",        Icon: Crown,           color: "text-violet-600", bg: "bg-violet-50" },
  { href: "/stats",     label: "Estadísticas",  Icon: BarChart2,       color: "text-amber-600",  bg: "bg-amber-50"  },
  { href: "/settings",  label: "Mi tienda",     Icon: Store,           color: "text-rose-600",   bg: "bg-rose-50"   },
  { href: "/inventory", label: "Inventario",    Icon: Layers,          color: "text-violet-600", bg: "bg-violet-50" },
  { href: "/mensajes",  label: "Mensajes",      Icon: MessageCircle,   color: "text-green-600",  bg: "bg-green-50"  },
];

export default function AdminBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const chatUnread = useChatUnread("VENDOR");

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const moreActive = MORE_ITEMS.some(({ href }) => isActive(href));

  return (
    <>
      {showMore && (
        <div
          className="md:hidden fixed inset-0 z-30"
          onClick={() => setShowMore(false)}
        >
          <div
            className="absolute bottom-20 right-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-52"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Más opciones</span>
              <button onClick={() => setShowMore(false)}>
                <X size={14} className="text-gray-400" />
              </button>
            </div>
            {MORE_ITEMS.map(({ href, label, Icon, color, bg }) => {
              const active = isActive(href);
              const showBadge = href === "/mensajes" && chatUnread > 0;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setShowMore(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50 ${active ? "bg-gray-50" : ""}`}
                >
                  <div className={`relative w-8 h-8 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={color} strokeWidth={2} />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {chatUnread > 9 ? "9+" : chatUnread}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${active ? color : "text-gray-700"}`}>{label}</span>
                  {active && <span className={`ml-auto w-1.5 h-1.5 rounded-full ${bg.replace("bg-", "bg-").replace("50", "500")}`} />}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] ${pathname === "/mensajes" ? "hidden" : ""}`}>
        <div className="flex items-center justify-around px-2 py-1">

          {LEFT_ITEMS.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href}
                className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2">
                {active && (
                  <span className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-violet-600" />
                )}
                <span className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${active ? "bg-violet-50" : ""}`}>
                  <Icon size={20} strokeWidth={active ? 2.25 : 1.75}
                    className={active ? "text-violet-600" : "text-gray-400"} />
                </span>
                <span className={`text-[10px] font-semibold leading-none ${active ? "text-violet-600" : "text-gray-400"}`}>
                  {label}
                </span>
              </Link>
            );
          })}

          <div className="flex flex-col items-center justify-center flex-1 py-1">
            <button
              type="button"
              onClick={() => router.push("/products/new")}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 shadow-lg shadow-violet-200 hover:bg-violet-700 active:scale-95 transition-all"
              aria-label="Agregar producto"
            >
              <Plus size={22} strokeWidth={2.5} className="text-white" />
            </button>
          </div>

          {RIGHT_ITEMS.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href}
                className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2">
                {active && (
                  <span className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-violet-600" />
                )}
                <span className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${active ? "bg-violet-50" : ""}`}>
                  <Icon size={20} strokeWidth={active ? 2.25 : 1.75}
                    className={active ? "text-violet-600" : "text-gray-400"} />
                </span>
                <span className={`text-[10px] font-semibold leading-none ${active ? "text-violet-600" : "text-gray-400"}`}>
                  {label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setShowMore(!showMore)}
            className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2"
          >
            {(moreActive || showMore) && (
              <span className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-violet-600" />
            )}
            <span className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all ${(moreActive || showMore) ? "bg-violet-50" : ""}`}>
              <MoreHorizontal size={20} strokeWidth={(moreActive || showMore) ? 2.25 : 1.75}
                className={(moreActive || showMore) ? "text-violet-600" : "text-gray-400"} />
              {chatUnread > 0 && !moreActive && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {chatUnread > 9 ? "9+" : chatUnread}
                </span>
              )}
            </span>
            <span className={`text-[10px] font-semibold leading-none ${(moreActive || showMore) ? "text-violet-600" : "text-gray-400"}`}>
              Más
            </span>
          </button>

        </div>
      </nav>
    </>
  );
}
