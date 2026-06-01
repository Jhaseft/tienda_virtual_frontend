"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { InventoryItem, StockStatus } from "@/types/admin";

const STOCK_BADGE: Record<StockStatus, string> = {
  OK: "bg-emerald-100 text-emerald-700",
  LOW: "bg-amber-100 text-amber-700",
  OUT: "bg-rose-100 text-rose-700",
};

interface Props {
  item: InventoryItem;
  onSaveStock: (productId: string, stock: number) => void;
  isSaving?: boolean;
}

export default function ProductStockCard({ item, onSaveStock, isSaving }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {/* ── Fila principal ── */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center gap-3 bg-white px-4 py-3 text-left transition active:bg-zinc-50"
      >
        {/* Imagen */}
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-14 w-14 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-[11px] font-bold text-violet-500">
            {item.name.slice(0, 3).toUpperCase()}
          </div>
        )}

        {/* Nombre y precio */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight text-zinc-900">{item.name}</p>
          <p className="mt-0.5 text-xs text-zinc-400">Bs {item.price.toFixed(2)}</p>
        </div>

        {/* Badge de stock */}
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STOCK_BADGE[item.stockStatus]}`}
        >
          {item.stock} uds.
        </span>

        {/* Indicador de expansión */}
        <span className="shrink-0 text-zinc-400">
          {expanded
            ? <ChevronUp size={16} aria-hidden="true" />
            : <ChevronDown size={16} aria-hidden="true" />}
        </span>
      </button>

      {/* ── Formulario inline expandible ── */}
      {expanded ? (
        <form
          className="border-t border-zinc-100 bg-zinc-50 px-4 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const stock = Number(fd.get("stock"));
            if (!Number.isNaN(stock) && stock >= 0) {
              onSaveStock(item.id, stock);
              setExpanded(false);
            }
          }}
        >
          <p className="mb-2 text-xs font-medium text-zinc-500">
            Editar stock — {item.name}
          </p>
          <div className="flex items-center gap-2">
            <input
              name="stock"
              type="number"
              min={0}
              defaultValue={item.stock}
              className="w-28 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-violet-300 focus:ring-2"
            />
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-xl bg-violet-700 py-2 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:opacity-60"
            >
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-100"
            >
              ✕
            </button>
          </div>
        </form>
      ) : null}

      <div className="mx-4 border-t border-zinc-100" />
    </div>
  );
}
