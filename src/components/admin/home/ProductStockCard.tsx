"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import type { InventoryItem, StockStatus } from "@/types/admin";

const STOCK_META: Record<StockStatus, { label: string; color: string; bg: string; dot: string }> = {
  OK:  { label: "En stock",   color: "text-emerald-700", bg: "bg-emerald-50",  dot: "bg-emerald-400" },
  LOW: { label: "Stock bajo", color: "text-amber-700",   bg: "bg-amber-50",    dot: "bg-amber-400"   },
  OUT: { label: "Agotado",    color: "text-rose-700",    bg: "bg-rose-50",     dot: "bg-rose-400"    },
};

interface Props {
  item: InventoryItem;
  onSaveStock: (productId: string, stock: number) => void;
  isSaving?: boolean;
}

export default function ProductStockCard({ item, onSaveStock, isSaving }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState(item.stock);
  const meta = STOCK_META[item.stockStatus];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value >= 0) {
      onSaveStock(item.id, value);
      setExpanded(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-all hover:border-violet-100 hover:shadow-md">

      {/* ── Fila principal ── */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        {/* Imagen / placeholder */}
        <div className="h-14 w-14 shrink-0 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
          ) : (
            <Package size={22} className="text-gray-300" strokeWidth={1.5} />
          )}
        </div>

        {/* Nombre + precio */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-gray-800 truncate leading-tight">{item.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">Bs {item.price.toFixed(2)}</p>
        </div>

        {/* Badge stock */}
        <span className={`hidden sm:flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.bg} ${meta.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          {item.stock} uds.
        </span>

        {/* Stock solo número en móvil */}
        <span className={`sm:hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${meta.bg} ${meta.color}`}>
          {item.stock}
        </span>

        {/* Indicador expandir */}
        <span className="shrink-0 text-gray-300 ml-1">
          {expanded
            ? <ChevronUp size={16} strokeWidth={2} />
            : <ChevronDown size={16} strokeWidth={2} />}
        </span>
      </button>

      {/* ── Panel edición stock ── */}
      {expanded && (
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-100 bg-gray-50 px-5 py-4"
        >
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
            Actualizar stock
          </p>

          <div className="flex items-center gap-3">
            {/* Stepper */}
            <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setValue((v) => Math.max(0, v - 1))}
                className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <Minus size={14} strokeWidth={2.5} />
              </button>
              <input
                type="number"
                min={0}
                value={value}
                onChange={(e) => setValue(Math.max(0, Number(e.target.value)))}
                className="w-16 text-center text-sm font-bold text-gray-800 bg-white outline-none py-2 border-x border-gray-200"
              />
              <button
                type="button"
                onClick={() => setValue((v) => v + 1)}
                className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* Guardar */}
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60 shadow-sm shadow-violet-200"
            >
              {isSaving ? "Guardando..." : "Guardar"}
            </button>

            {/* Cancelar */}
            <button
              type="button"
              onClick={() => { setExpanded(false); setValue(item.stock); }}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
