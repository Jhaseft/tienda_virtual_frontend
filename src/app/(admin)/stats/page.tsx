"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ChevronDown, ChevronRight, ShoppingBag, Users, TrendingUp } from "lucide-react";
import AdminShell from "@/components/admin/home/AdminShell";
import AdminMenuDropdown from "@/components/admin/home/AdminMenuDropdown";
import EmptyState from "@/components/admin/home/EmptyState";
import LoadingState from "@/components/admin/home/LoadingState";
import PageFooterHint from "@/components/ui/PageFooterHint";
import { getAdminStats } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { AdminStats } from "@/types/admin";

const PERIODS: Array<{ label: string; value: AdminStats["period"] }> = [
  { label: "Hoy",        value: "today" },
  { label: "Esta semana",value: "week"  },
  { label: "Este mes",   value: "month" },
  { label: "Este año",   value: "year"  },
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
    if (status === "loading" || !token) return;
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
    <AdminShell title="Estadísticas" subtitle="Resumen de tu negocio" rightSlot={<AdminMenuDropdown />}>

      {/* Selector de período */}
      <div className="relative mb-6 w-48">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as AdminStats["period"])}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-8 text-sm font-medium text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-violet-300 cursor-pointer"
        >
          {PERIODS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {sessionInvalid && <EmptyState title="Sesión no válida" description="Inicia sesión nuevamente." />}
      {!sessionInvalid && isLoading && <LoadingState text="Calculando estadísticas..." />}
      {!sessionInvalid && !isLoading && error && <EmptyState title="Error" description={error} />}

      {!sessionInvalid && !isLoading && !error && stats && (
        <div className="space-y-4">

          {/* Hero ventas */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Ventas totales</p>
            <p className="text-4xl font-bold text-gray-900 tracking-tight">
              Bs {stats.totalSales.toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {stats.from && stats.to && (
              <p className="mt-1.5 text-xs text-gray-400">
                Del {new Date(stats.from).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" })} al {new Date(stats.to).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            )}
            <MiniChart />
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-3 gap-3">
            <MetricCard
              label="Pedidos"
              value={String(stats.totalOrders)}
              icon={<ShoppingBag size={16} className="text-violet-500" />}
              bg="bg-violet-50"
            />
            <MetricCard
              label="Clientes nuevos"
              value={String(stats.newClients)}
              icon={<Users size={16} className="text-blue-500" />}
              bg="bg-blue-50"
            />
            <MetricCard
              label="Ticket promedio"
              value={`Bs ${stats.averageTicket.toFixed(0)}`}
              icon={<TrendingUp size={16} className="text-emerald-500" />}
              bg="bg-emerald-50"
            />
          </div>

          {/* Top productos */}
          {stats.topProducts.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Productos más vendidos</p>
              <div className="space-y-3">
                {stats.topProducts.map((product, i) => (
                  <div key={product.productId} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-300 w-4 shrink-0">{i + 1}</span>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-[10px] font-bold text-violet-500">
                      {product.name.slice(0, 3).toUpperCase()}
                    </div>
                    <p className="flex-1 text-sm text-gray-700 truncate">{product.name}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-sm font-bold text-gray-900">{product.quantity}</span>
                      <span className="text-xs text-gray-400">uds.</span>
                      <ChevronRight size={14} className="text-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <PageFooterHint message="Toma decisiones basadas en datos reales" />
    </AdminShell>
  );
}

function MetricCard({ label, value, icon, bg }: {
  label: string; value: string; icon: React.ReactNode; bg: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col gap-2">
      <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
      <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
      <p className="text-[11px] text-gray-400 leading-tight">{label}</p>
    </div>
  );
}

function MiniChart() {
  const pts = [
    [0, 68], [30, 62], [55, 58], [80, 64], [110, 50],
    [140, 55], [165, 38], [190, 42], [220, 28], [255, 18], [300, 8],
  ];
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L300,80 L0,80 Z`;

  return (
    <div className="mt-4">
      <svg viewBox="0 0 300 90" preserveAspectRatio="none" className="w-full" style={{ height: 80 }} aria-hidden="true">
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#sg)" />
        <path d={line} fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-gray-300 select-none">
        <span>1</span><span>8</span><span>15</span><span>22</span><span>31</span>
      </div>
    </div>
  );
}
