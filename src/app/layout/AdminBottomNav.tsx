"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Package, ShoppingBag, MoreHorizontal, Plus } from "lucide-react";

const LEFT_ITEMS = [
  { href: "/stats",     label: "Inicio",    Icon: Home    },
  { href: "/inventory", label: "Productos", Icon: Package },
];

const RIGHT_ITEMS = [
  { href: "/orders",   label: "Pedidos", Icon: ShoppingBag    },
  { href: "/settings", label: "Más",     Icon: MoreHorizontal },
];

export default function AdminBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
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

        {/* Botón + central */}
        <div className="flex flex-col items-center justify-center flex-1 py-1">
          <button
            type="button"
            onClick={() => router.push("/inventory/new")}
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
      </div>
    </nav>
  );
}
