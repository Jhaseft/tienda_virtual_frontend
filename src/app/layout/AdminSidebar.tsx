"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Users, Layers, BarChart2, Store, Home, Package, Crown, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useSyncExternalStore, useState } from "react";
import { useSession } from "next-auth/react";
import ToggleButton from "./ToggleButton";
import NavItem from "./NavItem";
import { getMySubscription, type MySubscription } from "@/lib/api/subscriptions";

const ITEMS: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Inicio",       Icon: Home        },
  { href: "/products",  label: "Productos",    Icon: Package     },
  { href: "/orders",    label: "Pedidos",      Icon: ShoppingBag },
  { href: "/customers", label: "Clientes",     Icon: Users       },
  { href: "/inventory", label: "Inventario",   Icon: Layers      },
  { href: "/planes",    label: "Planes",       Icon: Crown       },
  { href: "/stats",     label: "Estadísticas", Icon: BarChart2   },
  { href: "/settings",  label: "Mi tienda",    Icon: Store       },
];

const KEY = "sidebar-expanded";

function subscribe(cb: () => void) {
  window.addEventListener(KEY, cb);
  return () => window.removeEventListener(KEY, cb);
}
function getSnapshot() {
  const v = localStorage.getItem(KEY);
  return v === null ? true : v === "true";
}
function getServerSnapshot() { return true; }

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const expanded = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [sub, setSub] = useState<MySubscription | null>(null);

  useEffect(() => {
    localStorage.setItem(KEY, String(expanded));
  }, [expanded]);

  useEffect(() => {
    const token = session?.user?.backendToken;
    if (!token) return;
    getMySubscription(token).then(setSub).catch(() => null);
  }, [session?.user?.backendToken]);

  function toggle() {
    const next = !expanded;
    localStorage.setItem(KEY, String(next));
    window.dispatchEvent(new Event(KEY));
  }

  const isTrial = sub?.status === "TRIAL";
  const daysLeft = sub?.daysLeft ?? 0;

  return (
    <aside className={`hidden md:flex shrink-0 flex-col bg-linear-to-r from-emerald-50 to-white border-r border-emerald-100 h-full overflow-x-hidden overflow-y-auto transition-all duration-300 ease-in-out ${expanded ? "w-52" : "w-15"}`}>
      <nav className="flex-1 px-2 pb-3 pt-2 flex flex-col gap-0.5">
        {ITEMS.map(({ href, label, Icon }) => (
          <NavItem key={href} href={href} label={label} Icon={Icon}
            active={pathname === href || pathname.startsWith(`${href}/`)} expanded={expanded} />
        ))}
      </nav>

      {isTrial && expanded && (
        <div className="mx-2 mb-2 rounded-2xl bg-linear-to-br from-[#0f172a] to-[#1e3a5f] p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
              <Zap size={14} className="text-blue-300" strokeWidth={2.5} />
            </div>
            <p className="text-xs font-bold text-white leading-tight">Período de prueba</p>
          </div>
          <p className="text-[11px] text-blue-200 leading-snug mb-3">
            Te {daysLeft === 1 ? "queda" : "quedan"}{" "}
            <span className="text-white font-bold">{daysLeft} {daysLeft === 1 ? "día" : "días"}</span>{" "}
            de prueba gratuita.
          </p>
          <Link href="/planes" className="block w-full text-center text-xs font-semibold text-[#0f172a] bg-white hover:bg-blue-50 rounded-xl py-2 transition-colors">
            Elegir un plan →
          </Link>
        </div>
      )}

      <div className="px-2 pb-3">
        <ToggleButton expanded={expanded} onClick={toggle} />
      </div>
    </aside>
  );
}
