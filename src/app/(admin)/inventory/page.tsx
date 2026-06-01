"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminShell from "@/components/admin/home/AdminShell";
import AdminMenuDropdown from "@/components/admin/home/AdminMenuDropdown";
import EmptyState from "@/components/admin/home/EmptyState";
import LoadingState from "@/components/admin/home/LoadingState";
import ProductStockCard from "@/components/admin/home/ProductStockCard";
import SearchInput from "@/components/admin/home/SearchInput";
import PageFooterHint from "@/components/ui/PageFooterHint";
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
    if (status === "loading" || !token) return;
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
      setItems((prev) => prev.map((item) => (item.id === productId ? { ...item, ...updated } : item)));
      setSuccess("Stock actualizado correctamente.");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("No se pudo guardar el stock.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <AdminShell title="Inventario" subtitle="Gestiona el stock de tus productos" rightSlot={<AdminMenuDropdown />}>
      <SearchInput value={search} onChange={setSearch} placeholder="Buscar producto" />

      <div className="mt-4 space-y-3">
        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}
        {success && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">{success}</div>
        )}

        {sessionInvalid && <EmptyState title="Sesión no válida" description="Inicia sesión nuevamente." />}
        {!sessionInvalid && isLoading && <LoadingState text="Cargando inventario..." />}
        {!sessionInvalid && !isLoading && !error && items.length === 0 && (
          <EmptyState title="Sin productos" description="Cuando agregues productos aparecerán aquí." />
        )}
        {!sessionInvalid && !isLoading && items.length > 0 && items.map((item) => (
          <ProductStockCard
            key={item.id}
            item={item}
            isSaving={savingId === item.id}
            onSaveStock={handleSaveStock}
          />
        ))}
      </div>

      <PageFooterHint message="Mantén tu inventario siempre actualizado" />
    </AdminShell>
  );
}
