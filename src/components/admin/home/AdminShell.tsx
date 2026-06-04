"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ShoppingBag, Users, Layers, BarChart2, Store } from "lucide-react";
import AdminBottomNav from "../../../app/layout/AdminBottomNav";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "../../../app/layout/AdminSidebar";
import AdminTopBar from "../../../app/layout/AdminTopBar";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  rightSlot?: ReactNode;
  hideHeader?: boolean;
}

const PAGE_META: Record<string, { icon: ReactNode; color: string; bg: string }> = {
  "/orders":    { color: "text-violet-600", bg: "bg-violet-50",  icon: <ShoppingBag size={20} /> },
  "/customers": { color: "text-blue-600",   bg: "bg-blue-50",    icon: <Users size={20} />       },
  "/inventory": { color: "text-emerald-600",bg: "bg-emerald-50", icon: <Layers size={20} />      },
  "/stats":     { color: "text-amber-600",  bg: "bg-amber-50",   icon: <BarChart2 size={20} />   },
  "/settings":  { color: "text-rose-600",   bg: "bg-rose-50",    icon: <Store size={20} />       },
};

export default function AdminShell({ title, subtitle, children, rightSlot, hideHeader }: Props) {
  const pathname = usePathname();
  const base = "/" + (pathname.split("/")[1] ?? "");
  const meta = PAGE_META[base] ?? PAGE_META["/orders"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar fixed — solo desktop */}
      <div className="hidden md:block">
        <AdminTopBar />
      </div>

      <div className="flex md:pt-14 h-screen overflow-hidden">
        <AdminSidebar />

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Header mobile */}
          {!hideHeader && (
            <div className="md:hidden">
              <AdminHeader title={title} subtitle={subtitle} rightSlot={rightSlot} />
            </div>
          )}

          {/* Sub-header de página en desktop */}
          {!hideHeader && (
            <div className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}>
                  {meta.icon}
                </div>
                <div>
                  <h1 className="text-base font-bold text-gray-900 leading-tight">{title}</h1>
                  {subtitle && (
                    <p className="text-[12px] text-gray-400 leading-tight mt-0.5">{subtitle}</p>
                  )}
                </div>
              </div>
              {rightSlot && <div>{rightSlot}</div>}
            </div>
          )}

          <main className="flex-1 overflow-y-auto px-4 py-5 pb-24 md:px-8 md:py-6 md:pb-6">
            {children}
          </main>

          <AdminBottomNav />
        </div>
      </div>
    </div>
  );
}
