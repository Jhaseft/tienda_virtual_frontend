"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Users, Package, BarChart2, Store } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ITEMS: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/orders",    label: "Pedidos",      Icon: ShoppingBag },
  { href: "/customers", label: "Clientes",     Icon: Users       },
  { href: "/inventory", label: "Inventario",   Icon: Package     },
  { href: "/stats",     label: "Estadísticas", Icon: BarChart2   },
  { href: "/settings",  label: "Mi tienda",    Icon: Store       },
];

export default function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 border-t border-zinc-200 bg-white shadow-[0_-1px_8px_rgba(0,0,0,0.06)]">
      <div className="mx-auto grid w-full max-w-md grid-cols-5">
        {ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 py-2.5 px-1 text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-violet-700"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.25 : 1.75}
                aria-hidden="true"
              />
              <span className="leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
