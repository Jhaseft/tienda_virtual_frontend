"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminBottomNav from "@/components/admin/AdminBottomNav";
import AdminMenuDropdown from "@/components/admin/AdminMenuDropdown";
import EmptyState from "@/components/admin/EmptyState";
import LoadingState from "@/components/admin/LoadingState";
import ProductStockCard from "@/components/admin/ProductStockCard";
import SearchInput from "@/components/admin/SearchInput";
import { getAdminInventory, updateProductStock } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { InventoryItem } from "@/types/admin";

export default function InventoryPage() {
  const { data: session, status } = useSession();
  const token = session?.user.backendToken;
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const sessionInvalid = status !== "loading" && !token;

  useEffect(() => {
    if (status === "loading") return;
    if (!token) return;

    const tok = token;
    let active = true;

    void (async () => {
      setIsLoading(true);
      setSuccess(null);
      try {
        const response = await getAdminInventory({ token: tok, search: search || undefined, limit: 100 });
        if (active) setItems(response.data);
      } catch (err: unknown) {
        if (!active) return;
        if (err instanceof ApiError) setError(err.message);
        else setError("No se pudo cargar el inventario.");
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => { active = false; };
  }, [token, status, search]);

  async function handleSaveStock(productId: string, stock: number) {
    if (!token) return;
    setSavingId(productId);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updateProductStock(productId, stock, { token });
      setItems((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, ...updated } : item))
      );
      setSuccess("Stock actualizado correctamente.");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("No se pudo guardar el stock.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-sm">

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 bg-violet-700 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Inventario</h1>
            <AdminMenuDropdown />
          </div>
        </header>

        {/* ── Buscador ────────────────────────────────────────── */}
        <div className="bg-white px-4 py-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar producto"
          />
        </div>

        {/* ── Contenido ───────────────────────────────────────── */}
        <main className="flex-1 pb-32">

          {error ? (
            <p className="mx-4 mb-2 rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          {success ? (
            <p className="mx-4 mb-2 rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-700">{success}</p>
          ) : null}

          {sessionInvalid ? (
            <div className="p-4">
              <EmptyState title="Sesion no valida" description="Inicia sesion nuevamente." />
            </div>
          ) : null}

          {!sessionInvalid && isLoading ? (
            <div className="p-4">
              <LoadingState text="Cargando inventario..." />
            </div>
          ) : null}

          {!sessionInvalid && !isLoading && !error && items.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="Sin productos"
                description="Cuando agregues productos apareceran aqui."
              />
            </div>
          ) : null}

          {!sessionInvalid && !isLoading && items.length > 0 ? (
            <div>
              {items.map((item) => (
                <ProductStockCard
                  key={item.id}
                  item={item}
                  isSaving={savingId === item.id}
                  onSaveStock={handleSaveStock}
                />
              ))}
            </div>
          ) : null}

        </main>

        {/* ── BottomNav ────────────────────────────────────────── */}
        <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2">
          <AdminBottomNav />
        </div>

      </div>
    </div>
  );
}
