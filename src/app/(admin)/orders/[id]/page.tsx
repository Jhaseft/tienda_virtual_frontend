"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import AdminBottomNav from "@/components/admin/AdminBottomNav";
import AdminMenuDropdown from "@/components/admin/AdminMenuDropdown";
import EmptyState from "@/components/admin/EmptyState";
import LoadingState from "@/components/admin/LoadingState";
import StatusBadge from "@/components/admin/StatusBadge";
import { getAdminOrderById, updateAdminOrderStatus } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { AdminOrder, AdminOrderStatus } from "@/types/admin";

const NEXT_STATUS_BY_CURRENT: Partial<Record<AdminOrderStatus, AdminOrderStatus>> = {
  PENDING: "PAID",
  CONFIRMED: "PAID",
  PAID: "SHIPPED",
  SHIPPED: "DELIVERED",
};

const ACTION_LABEL_BY_STATUS: Partial<Record<AdminOrderStatus, string>> = {
  PENDING: "Marcar como pagado",
  CONFIRMED: "Marcar como pagado",
  PAID: "Marcar como enviado",
  SHIPPED: "Marcar como entregado",
};

const CANCELLABLE: Set<AdminOrderStatus> = new Set(["PENDING", "CONFIRMED", "PAID"]);

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.user.backendToken;
  const sessionInvalid = status !== "loading" && !token;

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!token) return;

    getAdminOrderById(orderId, { token })
      .then((data) => setOrder(data))
      .catch((err: unknown) => {
        if (err instanceof ApiError) {
          setError(err.message);
          return;
        }
        setError("No se pudo cargar el pedido.");
      })
      .finally(() => setIsLoading(false));
  }, [orderId, token, status]);

  const nextStatus = order ? NEXT_STATUS_BY_CURRENT[order.status] : undefined;
  const actionLabel = order ? ACTION_LABEL_BY_STATUS[order.status] : undefined;
  const canCancel = order ? CANCELLABLE.has(order.status) : false;

  const whatsappHref = useMemo(() => {
    if (!order?.client.phoneNumber) return null;
    const phone = order.client.phoneNumber.replace(/[^\d]/g, "");
    const msg = encodeURIComponent(`Hola, te escribimos por tu pedido #${order.orderSeq}.`);
    return `https://wa.me/${phone}?text=${msg}`;
  }, [order]);

  async function handleAdvanceStatus() {
    if (!token || !order || !nextStatus) return;
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const updated = await updateAdminOrderStatus(order.id, nextStatus, { token });
      setOrder(updated);
      setSuccessMsg("Estado actualizado correctamente.");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("No se pudo actualizar el estado.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCancel() {
    if (!token || !order) return;
    if (!window.confirm("¿Cancelar este pedido? Esta acción no se puede deshacer.")) return;
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const updated = await updateAdminOrderStatus(order.id, "CANCELLED", { token });
      setOrder(updated);
      setSuccessMsg("Pedido cancelado.");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("No se pudo cancelar el pedido.");
    } finally {
      setIsSaving(false);
    }
  }

  const clientName =
    `${order?.client.firstName ?? ""} ${order?.client.lastName ?? ""}`.trim() || "Cliente";

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-sm">

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 bg-violet-700 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-violet-600"
              aria-label="Volver"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
            </button>

            <h1 className="text-base font-semibold">
              {order ? `Pedido #${String(order.orderSeq).padStart(5, "0")}` : "Detalle"}
            </h1>

            <AdminMenuDropdown />
          </div>
        </header>

        {/* ── Contenido ──────────────────────────────────────── */}
        <main className="flex flex-1 flex-col pb-32">

          {sessionInvalid ? (
            <div className="p-4">
              <EmptyState title="Sesion no valida" description="Inicia sesion nuevamente." />
            </div>
          ) : null}

          {!sessionInvalid && isLoading ? (
            <div className="p-4">
              <LoadingState text="Cargando pedido..." />
            </div>
          ) : null}

          {!sessionInvalid && !isLoading && error ? (
            <div className="p-4">
              <EmptyState title="Error" description={error} />
            </div>
          ) : null}

          {!sessionInvalid && !isLoading && !error && order ? (
            <>
              {/* Status badge */}
              <div className="px-4 pt-4 pb-2">
                <StatusBadge status={order.status} />
              </div>

              {/* Feedback de éxito */}
              {successMsg ? (
                <p className="mx-4 mb-1 rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-700">{successMsg}</p>
              ) : null}

              {/* ── Cliente ─────────────────────────── */}
              <section className="px-4 py-3">
                <p className="mb-1 text-xs font-medium text-zinc-400 uppercase tracking-wide">Cliente</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold text-zinc-900">{clientName}</p>
                    <p className="text-sm text-zinc-500">
                      {order.client.phoneNumber || order.client.email || "Sin contacto"}
                    </p>
                  </div>
                  {whatsappHref ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Contactar por WhatsApp"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 active:scale-95"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </a>
                  ) : null}
                </div>
              </section>

              <div className="mx-4 border-t border-zinc-100" />

              {/* ── Productos ───────────────────────── */}
              <section className="px-4 py-3">
                <p className="mb-3 text-xs font-medium text-zinc-400 uppercase tracking-wide">Productos</p>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-[11px] font-bold text-violet-500">
                        {item.productName.slice(0, 3).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 leading-tight">{item.productName}</p>
                        {item.size ? (
                          <p className="text-xs text-zinc-400 mt-0.5">Talla: {item.size}</p>
                        ) : null}
                        {item.colorName ? (
                          <p className="text-xs text-zinc-400">Color: {item.colorName}</p>
                        ) : null}
                        <p className="text-sm font-medium text-zinc-700 mt-0.5">
                          Bs {item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-zinc-500">
                        x{item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="mx-4 border-t border-zinc-100" />

              {/* ── Resumen de costos ───────────────── */}
              <div className="px-4 py-3 space-y-1">
                {order.subtotal > 0 && order.subtotal !== order.total ? (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-500">Subtotal</p>
                    <p className="text-sm text-zinc-700">Bs {order.subtotal.toFixed(2)}</p>
                  </div>
                ) : null}
                {order.shippingCost > 0 ? (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-500">Envío</p>
                    <p className="text-sm text-zinc-700">Bs {order.shippingCost.toFixed(2)}</p>
                  </div>
                ) : null}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-500">Total</p>
                  <p className="text-base font-bold text-zinc-900">Bs {order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="mx-4 border-t border-zinc-100" />

              {/* ── Info rows ───────────────────────── */}
              <div className="space-y-0 px-4 py-3">
                <InfoRow label="Fecha" value={new Date(order.createdAt).toLocaleString()} />
                {order.paymentMethod ? (
                  <InfoRow label="Método de pago" value={order.paymentMethod} />
                ) : null}
              </div>

              {order.deliveryAddress ? (
                <>
                  <div className="mx-4 border-t border-zinc-100" />
                  <div className="px-4 py-3">
                    <p className="mb-1 text-xs font-medium text-zinc-400 uppercase tracking-wide">Dirección</p>
                    <p className="text-sm text-zinc-700">{order.deliveryAddress}</p>
                  </div>
                </>
              ) : null}

              {order.notes ? (
                <>
                  <div className="mx-4 border-t border-zinc-100" />
                  <div className="px-4 py-3">
                    <p className="mb-1 text-xs font-medium text-zinc-400 uppercase tracking-wide">Notas</p>
                    <p className="text-sm text-zinc-700">{order.notes}</p>
                  </div>
                </>
              ) : null}

              {error ? (
                <p className="mx-4 mt-2 rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p>
              ) : null}
            </>
          ) : null}
        </main>

        {/* ── Acciones + BottomNav ─────────────────────────────── */}
        <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2">

          {/* Pedido cerrado: DELIVERED o CANCELLED */}
          {!sessionInvalid && !isLoading && !error && order && !nextStatus && !canCancel ? (
            <div className="border-t border-zinc-100 bg-white px-4 py-3">
              <p className="text-center text-sm text-zinc-400">
                {order.status === "DELIVERED"
                  ? "Este pedido ya fue entregado."
                  : "Este pedido fue cancelado."}
              </p>
            </div>
          ) : null}

          {/* Acciones disponibles */}
          {!sessionInvalid && !isLoading && !error && order && (nextStatus || canCancel) ? (
            <div className="border-t border-zinc-100 bg-white px-4 py-3">
              <div className={`flex gap-2 ${nextStatus && canCancel ? "" : ""}`}>
                {canCancel ? (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleCancel}
                    className="rounded-2xl border border-zinc-200 px-4 py-3.5 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50 active:scale-[0.98] disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                ) : null}
                {nextStatus && actionLabel ? (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleAdvanceStatus}
                    className="flex-1 rounded-2xl bg-violet-700 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-800 active:scale-[0.98] disabled:opacity-60"
                  >
                    {isSaving ? "Guardando..." : actionLabel}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          <AdminBottomNav />
        </div>

      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-0.5">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="text-sm text-zinc-800">{value}</p>
    </div>
  );
}
