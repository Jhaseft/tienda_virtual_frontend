"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminShell from "@/components/admin/home/AdminShell";
import AdminMenuDropdown from "@/components/admin/home/AdminMenuDropdown";
import CustomerCard from "@/components/admin/home/CustomerCard";
import EmptyState from "@/components/admin/home/EmptyState";
import LoadingState from "@/components/admin/home/LoadingState";
import SearchInput from "@/components/admin/home/SearchInput";
import { getAdminCustomers } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { AdminCustomer } from "@/types/admin";
import PageFooterHint from "@/components/ui/PageFooterHint";

export default function CustomersPage() {
  const { data: session, status } = useSession();
  const token = session?.user.backendToken;
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sessionInvalid = status !== "loading" && !token;

  useEffect(() => {
    if (status === "loading") return;
    if (!token) return;

    getAdminCustomers({ token, search: search || undefined, limit: 100 })
      .then((response) => setCustomers(response.data))
      .catch((err: unknown) => {
        if (err instanceof ApiError) {
          setError(err.message);
          return;
        }
        setError("No se pudo cargar clientes.");
      })
      .finally(() => setIsLoading(false));
  }, [token, status, search]);

  return (
    <AdminShell title="Clientes" subtitle="Lista de tus clientes" rightSlot={<AdminMenuDropdown />}>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar cliente por nombre o telefono"
      />

      <div className="mt-4" />

      {sessionInvalid ? (
        <EmptyState
          title="Sesion no valida"
          description="Inicia sesion nuevamente para continuar."
        />
      ) : null}
      {!sessionInvalid && isLoading ? <LoadingState text="Cargando clientes..." /> : null}
      {!sessionInvalid && !isLoading && error ? (
        <EmptyState title="Error" description={error} />
      ) : null}
      {!sessionInvalid && !isLoading && !error && customers.length === 0 ? (
        <EmptyState
          title="Sin clientes registrados"
          description="Cuando tengas pedidos, veras aqui tus clientes."
        />
      ) : null}
      {!sessionInvalid && !isLoading && !error && customers.length > 0 ? (
        <div className="space-y-3">
          {customers.map((customer) => (
            <CustomerCard key={customer.clientId} customer={customer} />
          ))}
        </div>
      ) : null}

      <PageFooterHint message="Gestiona tus clientes de manera profesional" />
    </AdminShell>
  );
}
