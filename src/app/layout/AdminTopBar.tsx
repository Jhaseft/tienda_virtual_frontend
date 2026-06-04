"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Bell, Store, LogOut, User, ChevronDown, ExternalLink } from "lucide-react";
import Image from "next/image";
import TopBarTips from "@/components/admin/layout/TopBarTips";

export default function AdminTopBar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const name = session?.user?.name || "Vendedor";
  const email = session?.user?.email ?? "";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "V";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-gray-100 shadow-sm flex items-center px-4 gap-3">
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0 mr-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow">
          <Store size={14} className="text-white" strokeWidth={2} />
        </div>
        <span className="text-gray-800 font-semibold text-sm hidden lg:block">Shopiva</span>
      </Link>

      <TopBarTips />

      <div className="flex items-center gap-1 ml-auto">
        <Link
          href="/"
          target="_blank"
          className="hidden lg:flex items-center gap-1.5 text-gray-400 hover:text-emerald-600 text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-all"
        >
          <ExternalLink size={13} />
          Ver tienda
        </Link>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
          <Bell size={16} />
        </button>

        <div ref={dropdownRef} className="relative ml-1">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-all"
          >
            {session?.user?.image ? (
              <Image src={session.user.image} alt={name} width={28} height={28} className="rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {initials}
              </div>
            )}
            <ChevronDown size={13} className="text-gray-400 hidden lg:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                <p className="text-xs text-gray-400 truncate">{email}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={15} className="text-gray-400" />
                Mi tienda
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
