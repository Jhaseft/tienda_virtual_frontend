"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Store } from "lucide-react";

export default function AdminMenuDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Más opciones"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-violet-600 transition-colors"
      >
        <MoreVertical size={20} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 min-w-[210px] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push("/");
            }}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-zinc-50 active:bg-zinc-100 transition-colors"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100">
              <Store size={16} className="text-violet-700" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Ingresar como cliente</p>
              <p className="text-xs text-zinc-400">Explorar tiendas y productos</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
