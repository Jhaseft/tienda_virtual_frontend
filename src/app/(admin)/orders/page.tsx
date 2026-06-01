"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import AdminShell from "@/components/admin/AdminShell";
import AdminMenuDropdown from "@/components/admin/AdminMenuDropdown";
import EmptyState from "@/components/admin/EmptyState";
import LoadingState from "@/components/admin/LoadingState";
import OrderCard from "@/components/admin/OrderCard";
import { ApiError } from "@/lib/api/client";
import { getAdminOrders } from "@/lib/api/admin";
import type { AdminOrder, AdminOrderStatus } from "@/types/admin";

const ORDER_FILTERS: Array<{
  label: string;
  value: AdminOrderStatus | "ALL";
}> = [
  { label: "Todos", value: "ALL" },
  { label: "Pendientes", value: "PENDING" },
  { label: "Confirmados", value: "CONFIRMED" },
  { label: "Pagados", value: "PAID" },
  { label: "Enviados", value: "SHIPPED" },
  { label: "Entregados", value: "DELIVERED" },
  { label: "Cancelados", value: "CANCELLED" },
];

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const token = session?.user.backendToken;

  const [selectedFilter, setSelectedFilter] = useState<AdminOrderStatus | "ALL">(
    "ALL"
  );
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sessionInvalid = status !== "loading" && !token;

  useEffect(() => {
    if (status === "loading") return;
    if (!token) return;

    const controller = new AbortController();

    getAdminOrders({
      token,
      status: selectedFilter === "ALL" ? undefined : selectedFilter,
      limit: 50,
    })
      .then((response) => {
        if (!controller.signal.aborted) setOrders(response.data);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        if (err instanceof ApiError) {
          setError(err.message);
          return;
        }
        setError("No se pudo cargar pedidos.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [token, status, selectedFilter]);

  const content = useMemo(() => {
    if (sessionInvalid) {
      return (
        <EmptyState
          title="Sesion no valida"
          description="Inicia sesion nuevamente para continuar."
        />
      );
    }
    if (isLoading) return <LoadingState text="Cargando pedidos..." />;
    if (error) return <EmptyState title="Error al cargar" description={error} />;
    if (orders.length === 0) {
      return (
        <EmptyState
          title="Sin pedidos"
          description="No hay pedidos en esta categoria todavia."
        />
      );
    }

    return (
      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    );
  }, [isLoading, sessionInvalid, error, orders]);

  return (
    <AdminShell title="Pedidos" subtitle="Todos los pedidos recibidos" rightSlot={<AdminMenuDropdown />}>
      {/* Tabs de filtro horizontales */}
      <div className="-mx-4 mb-4 flex overflow-x-auto border-b border-zinc-200 px-4">
        {ORDER_FILTERS.map((filter) => {
          const active = filter.value === selectedFilter;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => {
                setOrders([]);
                setError(null);
                setIsLoading(true);
                setSelectedFilter(filter.value);
              }}
              className={`shrink-0 px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
                active
                  ? "border-b-2 border-violet-600 text-violet-700"
                  : "border-b-2 border-transparent text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
      {content}
    </AdminShell>
  );
}
