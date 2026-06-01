"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminBottomNav from "@/components/admin/AdminBottomNav";
import AdminMenuDropdown from "@/components/admin/AdminMenuDropdown";
import EmptyState from "@/components/admin/EmptyState";
import LoadingState from "@/components/admin/LoadingState";
import { getAdminStats } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { AdminStats } from "@/types/admin";

const PERIODS: Array<{ label: string; value: AdminStats["period"] }> = [
  { label: "Este día", value: "today" },
  { label: "Esta semana", value: "week" },
  { label: "Este mes", value: "month" },
  { label: "Este año", value: "year" },
];

export default function StatsPage() {
  const { data: session, status } = useSession();
  const token = session?.user.backendToken;
  const [period, setPeriod] = useState<AdminStats["period"]>("month");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sessionInvalid = status !== "loading" && !token;

  useEffect(() => {
    if (status === "loading") return;
    if (!token) return;

    const tok = token;
    let active = true;

    void (async () => {
      setIsLoading(true);
      setStats(null);
      try {
        const data = await getAdminStats(period, { token: tok });
        if (active) setStats(data);
      } catch (err: unknown) {
        if (!active) return;
        if (err instanceof ApiError) setError(err.message);
        else setError("No se pudieron cargar estadísticas.");
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => { active = false; };
  }, [token, status, period]);

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-sm">

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 bg-violet-700 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Estadísticas</h1>
            <AdminMenuDropdown />
          </div>
        </header>

        <main className="flex-1 pb-24">

          {/* ── Selector de período ─────────────────────────── */}
          <div className="px-4 pt-4 pb-2">
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as AdminStats["period"])}
                className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-zinc-800 outline-none ring-violet-300 focus:ring-2"
              >
                {PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>

          {sessionInvalid && (
            <div className="p-4">
              <EmptyState title="Sesion no valida" description="Inicia sesion nuevamente." />
            </div>
          )}

          {!sessionInvalid && isLoading && (
            <div className="p-4">
              <LoadingState text="Calculando estadísticas..." />
            </div>
          )}

          {!sessionInvalid && !isLoading && error && (
            <div className="p-4">
              <EmptyState title="Error" description={error} />
            </div>
          )}

          {!sessionInvalid && !isLoading && !error && stats && (
            <>
              {/* ── Hero: ventas totales ─────────────────────── */}
              <div className="px-4 pt-2 pb-1">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Ventas totales</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
                  Bs {stats.totalSales.toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {stats.from && stats.to ? (
                  <p className="mt-1 text-xs text-zinc-400">
                    Del {new Date(stats.from).toLocaleDateString("es-BO", { day: "2-digit", month: "2-digit", year: "numeric" })} al {new Date(stats.to).toLocaleDateString("es-BO", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </p>
                ) : null}
              </div>

              {/* ── Gráfico decorativo ───────────────────────── */}
              <MiniChart />

              <div className="mx-4 border-t border-zinc-100" />

              {/* ── Resumen ──────────────────────────────────── */}
              <p className="px-4 pt-4 pb-2 text-sm font-semibold text-zinc-900">Resumen</p>

              <StatRow
                label="Pedidos"
                value={String(stats.totalOrders)}
              />
              <div className="mx-4 border-t border-zinc-100" />
              <StatRow
                label="Clientes nuevos"
                value={String(stats.newClients)}
              />
              <div className="mx-4 border-t border-zinc-100" />
              <StatRow
                label="Ticket promedio"
                value={`Bs ${stats.averageTicket.toFixed(2)}`}
              />
              <div className="mx-4 border-t border-zinc-100" />

              {/* Productos más vendidos */}
              <div className="px-4 py-3.5">
                <p className="text-sm font-semibold text-zinc-700">Productos más vendidos</p>
              </div>

              {stats.topProducts.length > 0 && (
                <div className="mx-4 mb-4 space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50 p-3">
                  {stats.topProducts.map((product) => (
                    <div key={product.productId} className="flex items-center justify-between text-sm">
                      <p className="text-zinc-700 truncate max-w-[70%]">{product.name}</p>
                      <p className="font-semibold text-zinc-900">{product.quantity} uds.</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2">
          <AdminBottomNav />
        </div>
      </div>
    </div>
  );
}

/* ── Gráfico SVG decorativo (área + línea) ────────────────────────────────── */
function MiniChart() {
  // Puntos decorativos (x de 0 a 300, y de 0 a 80 donde 0 = arriba)
  const pts = [
    [0, 68], [30, 62], [55, 58], [80, 64], [110, 50],
    [140, 55], [165, 38], [190, 42], [220, 28], [255, 18], [300, 8],
  ];

  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L300,80 L0,80 Z`;

  return (
    <div className="px-4 py-3">
      <svg
        viewBox="0 0 300 90"
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: 90 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#sg)" />
        <path
          d={line}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Etiquetas eje X */}
      <div className="mt-1 flex justify-between px-0.5 text-[10px] text-zinc-400 select-none">
        <span>1</span>
        <span>8</span>
        <span>15</span>
        <span>22</span>
        <span>31</span>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <p className="text-sm text-zinc-700">{label}</p>
      <div className="flex items-center gap-1">
        <p className="text-sm font-semibold text-zinc-900">{value}</p>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
          className="h-4 w-4 text-zinc-300">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
