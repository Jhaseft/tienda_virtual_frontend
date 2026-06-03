"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Users, Layers, BarChart2, Store, Home, ChevronRight, Package, Crown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ITEMS: { href: string; label: string; Icon: LucideIcon; color: string; activeBg: string; activeText: string; activeBorder: string }[] = [
  { href: "/dashboard", label: "Inicio", Icon: Home, color: "text-gray-500", activeBg: "bg-gray-100", activeText: "text-gray-900", activeBorder: "border-gray-500" },
  { href: "/products", label: "Productos", Icon: Package, color: "text-violet-500", activeBg: "bg-violet-50", activeText: "text-violet-700", activeBorder: "border-violet-500" },
  { href: "/orders", label: "Pedidos", Icon: ShoppingBag, color: "text-violet-500", activeBg: "bg-violet-50", activeText: "text-violet-700", activeBorder: "border-violet-500" },
  { href: "/customers", label: "Clientes", Icon: Users, color: "text-blue-500", activeBg: "bg-blue-50", activeText: "text-blue-700", activeBorder: "border-blue-500" },
  { href: "/inventory", label: "Inventario", Icon: Layers, color: "text-emerald-500", activeBg: "bg-emerald-50", activeText: "text-emerald-700", activeBorder: "border-emerald-500" },
  { href: "/planes", label: "Planes", Icon: Crown, color: "text-violet-500", activeBg: "bg-violet-50", activeText: "text-violet-700", activeBorder: "border-violet-500" },
  { href: "/stats", label: "Estadísticas", Icon: BarChart2, color: "text-amber-500", activeBg: "bg-amber-50", activeText: "text-amber-700", activeBorder: "border-amber-500" },
  { href: "/settings", label: "Mi tienda", Icon: Store, color: "text-rose-500", activeBg: "bg-rose-50", activeText: "text-rose-700", activeBorder: "border-rose-500" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col bg-white border-r border-gray-100 h-screen sticky top-0 overflow-y-auto shadow-sm">

      <div className="px-4 pt-4 pb-1">
        <div className="relative bg-linear-to-br from-violet-600 to-violet-400 rounded-2xl px-4 py-4 shadow-lg shadow-violet-200 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -right-2 w-16 h-16 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30">
              <Store size={18} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Panel Vendedor</p>
              <p className="text-xs text-violet-200 leading-tight mt-0.5">Gestiona tu tienda</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 flex flex-col gap-1">
        {ITEMS.map(({ href, label, Icon, activeBg, activeText, color }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${active
                ? `${activeBg} ${activeText} border-transparent`
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 border-transparent"
                }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${active ? "bg-white shadow-sm" : "bg-gray-50 group-hover:bg-white group-hover:shadow-sm"
                }`}>
                <Icon size={16} strokeWidth={active ? 2.25 : 1.75} className={active ? activeText : color} />
              </div>
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="opacity-40" />}
            </Link>
          );
        })}
      </nav>


      <div className="px-4 py-4">
        <Link
          href="/"
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center shrink-0 transition-all">
            <Home size={16} strokeWidth={1.75} className="text-gray-400 group-hover:text-gray-600" />
          </div>
          <span>Ir a la tienda</span>
        </Link>
      </div>

    </aside>
  );
}
