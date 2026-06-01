"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/home/AdminShell";
import BackButton from "@/components/ui/BackButton";
import AdminMenuDropdown from "@/components/admin/home/AdminMenuDropdown";
import EmptyState from "@/components/admin/home/EmptyState";
import LoadingState from "@/components/admin/home/LoadingState";
import StatusBadge from "@/components/admin/home/StatusBadge";
import OrderDetailClient from "@/components/admin/orderDetail/OrderDetailClient";
import OrderDetailProducts from "@/components/admin/orderDetail/OrderDetailProducts";
import OrderDetailInfo from "@/components/admin/orderDetail/OrderDetailInfo";
import OrderDetailActions from "@/components/admin/orderDetail/OrderDetailActions";
import { getAdminOrderById, updateAdminOrderStatus } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { AdminOrder, AdminOrderStatus } from "@/types/admin";

const NEXT_STATUS: Partial<Record<AdminOrderStatus, AdminOrderStatus>> = {
  PENDING: "PAID",
  CONFIRMED: "PAID",
  PAID: "SHIPPED",
  SHIPPED: "DELIVERED",
};

const ACTION_LABEL: Partial<Record<AdminOrderStatus, string>> = {
  PENDING: "Marcar como pagado",
  CONFIRMED: "Marcar como pagado",
  PAID: "Marcar como enviado",
  SHIPPED: "Marcar como entregado",
};

const CANCELLABLE: Set<AdminOrderStatus> = new Set(["PENDING", "CONFIRMED", "PAID"]);

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: session, status } = useSession();
  const token = session?.user.backendToken;
  const sessionInvalid = status !== "loading" && !token;

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading" || !token) return;
    getAdminOrderById(params.id, { token })
      .then(setOrder)
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "No se pudo cargar el pedido.");
      })
      .finally(() => setIsLoading(false));
  }, [params.id, token, status]);

  const nextStatus = order ? NEXT_STATUS[order.status] : undefined;
  const actionLabel = order ? ACTION_LABEL[order.status] : undefined;
  const canCancel = order ? CANCELLABLE.has(order.status) : false;

  const whatsappHref = useMemo(() => {
    if (!order?.client.phoneNumber) return null;
    const phone = order.client.phoneNumber.replace(/[^\d]/g, "");
    const msg = encodeURIComponent(`Hola, te escribimos por tu pedido #${order.orderSeq}.`);
    return `https://wa.me/${phone}?text=${msg}`;
  }, [order]);

  async function handleAdvanceStatus() {
    if (!token || !order || !nextStatus) return;
    setIsSaving(true); setError(null); setSuccessMsg(null);
    try {
      setOrder(await updateAdminOrderStatus(order.id, nextStatus, { token }));
      setSuccessMsg("Estado actualizado correctamente.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo actualizar el estado.");
    } finally { setIsSaving(false); }
  }

  async function handleCancel() {
    if (!token || !order) return;
    if (!window.confirm("¿Cancelar este pedido? Esta acción no se puede deshacer.")) return;
    setIsSaving(true); setError(null); setSuccessMsg(null);
    try {
      setOrder(await updateAdminOrderStatus(order.id, "CANCELLED", { token }));
      setSuccessMsg("Pedido cancelado.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo cancelar el pedido.");
    } finally { setIsSaving(false); }
  }

  const title = order ? `Pedido #${String(order.orderSeq).padStart(5, "0")}` : "Detalle de pedido";

  return (
    <AdminShell title="Detalle del Pedido" subtitle={`revisa el estado del ${title}`} rightSlot={<AdminMenuDropdown />}>
      <BackButton label={title} />

      

      {sessionInvalid && <EmptyState title="Sesión no válida" description="Inicia sesión nuevamente." />}
      {!sessionInvalid && isLoading && <LoadingState text="Cargando pedido..." />}
      {!sessionInvalid && !isLoading && error && <EmptyState title="Error" description={error} />}

      {!sessionInvalid && !isLoading && !error && order && (
        <div className="space-y-4">
          {successMsg && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">
              {successMsg}
            </div>
          )}

          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            {order.status === "DELIVERED" && <span className="text-xs text-gray-400">Este pedido ya fue entregado.</span>}
            {order.status === "CANCELLED" && <span className="text-xs text-gray-400">Este pedido fue cancelado.</span>}
          </div>

          <OrderDetailClient order={order} whatsappHref={whatsappHref} />
          <OrderDetailProducts order={order} />
          <OrderDetailInfo order={order} />
          <OrderDetailActions
            actionLabel={actionLabel}
            canCancel={canCancel}
            isSaving={isSaving}
            onAdvance={handleAdvanceStatus}
            onCancel={handleCancel}
          />
        </div>
      )}
    </AdminShell>
  );
}
