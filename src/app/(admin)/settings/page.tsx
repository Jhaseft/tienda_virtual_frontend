"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminBottomNav from "@/components/admin/AdminBottomNav";
import AdminMenuDropdown from "@/components/admin/AdminMenuDropdown";
import EmptyState from "@/components/admin/EmptyState";
import LoadingState from "@/components/admin/LoadingState";
import {
  getStoreSettings,
  updateStorePaymentMethod,
  updateStoreSettings,
  uploadStoreImage,
} from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type {
  StorePaymentMethod,
  StoreSettings,
  UpdatePaymentMethodPayload,
} from "@/types/admin";

type EditSection = "name" | "whatsapp" | "description" | "address" | "payment" | null;

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.user.backendToken;
  const sessionInvalid = status !== "loading" && !token;

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editSection, setEditSection] = useState<EditSection>(null);

  // Editable field values
  const [nameVal, setNameVal] = useState("");
  const [whatsappVal, setWhatsappVal] = useState("");
  const [descriptionVal, setDescriptionVal] = useState("");
  const [addressVal, setAddressVal] = useState("");
  const [cityVal, setCityVal] = useState("");
  const [notificationsVal, setNotificationsVal] = useState(true);
  const [payment, setPayment] = useState<UpdatePaymentMethodPayload>({
    type: "QR",
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    qrImageUrl: "",
    qrImagePublicId: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!token) return;

    getStoreSettings({ token })
      .then((store) => {
        setSettings(store);
        syncFromStore(store);
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError) setError(err.message);
        else setError("No se pudo cargar la configuración.");
      })
      .finally(() => setIsLoading(false));
  }, [token, status]);

  function syncFromStore(store: StoreSettings) {
    setNameVal(store.name);
    setWhatsappVal(store.whatsapp ?? "");
    setDescriptionVal(store.description ?? "");
    setAddressVal(store.address ?? "");
    setCityVal(store.city ?? "");
    setNotificationsVal(store.owner.notificationsEnabled);
    const pm = store.paymentMethods.find((m) => m.type === "QR") ?? store.paymentMethods[0];
    if (pm) {
      setPayment({
        id: pm.id,
        type: pm.type,
        bankName: pm.bankName ?? "",
        accountHolder: pm.accountHolder ?? "",
        accountNumber: pm.accountNumber ?? "",
        qrImageUrl: pm.qrImageUrl ?? "",
        qrImagePublicId: pm.qrImagePublicId ?? "",
      });
    }
  }

  function openEdit(section: EditSection) {
    setEditSection(section);
    setError(null);
    setSuccess(null);
  }

  function cancelEdit() {
    if (settings) syncFromStore(settings);
    setEditSection(null);
    setError(null);
  }

  async function saveField(section: "name" | "whatsapp" | "description" | "address") {
    if (!token) return;
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload =
        section === "name" ? { name: nameVal }
        : section === "whatsapp" ? { whatsapp: whatsappVal }
        : section === "description" ? { description: descriptionVal }
        : { address: addressVal, city: cityVal };

      const updated = await updateStoreSettings(payload, { token });
      setSettings(updated);
      syncFromStore(updated);
      setSuccess("Guardado correctamente.");
      setEditSection(null);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("No se pudo guardar.");
    } finally {
      setIsSaving(false);
    }
  }

  async function savePayment() {
    if (!token) return;
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateStorePaymentMethod(payment, { token });
      const refreshed = await getStoreSettings({ token });
      setSettings(refreshed);
      syncFromStore(refreshed);
      setSuccess("Método de pago actualizado.");
      setEditSection(null);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("No se pudo guardar el método de pago.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleNotifications(checked: boolean) {
    if (!token) return;
    setNotificationsVal(checked);
    try {
      const updated = await updateStoreSettings({ notificationsEnabled: checked }, { token });
      setSettings(updated);
    } catch {
      setNotificationsVal(!checked); // revert on error
    }
  }

  async function handleUploadLogo(e: ChangeEvent<HTMLInputElement>) {
    if (!token || !e.target.files?.[0]) return;
    setError(null);
    setSuccess(null);
    try {
      const uploaded = await uploadStoreImage(e.target.files[0], "logo", { token });
      const updated = await updateStoreSettings(
        { logoUrl: uploaded.url, logoPublicId: uploaded.publicId },
        { token }
      );
      setSettings(updated);
      syncFromStore(updated);
      setSuccess("Logo actualizado.");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("No se pudo subir el logo.");
    } finally {
      e.target.value = "";
    }
  }

  async function handleUploadQr(e: ChangeEvent<HTMLInputElement>) {
    if (!token || !e.target.files?.[0]) return;
    setError(null);
    setSuccess(null);
    try {
      const uploaded = await uploadStoreImage(e.target.files[0], "qr", { token });
      setPayment((p) => ({ ...p, qrImageUrl: uploaded.url, qrImagePublicId: uploaded.publicId }));
      setSuccess("QR cargado. Presiona Guardar para confirmar el método de pago.");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("No se pudo subir el QR. Verifica la configuración de almacenamiento.");
    } finally {
      e.target.value = "";
    }
  }

  function paymentSummary(pm?: StorePaymentMethod) {
    if (!pm) return "Sin método de pago";
    if (pm.type === "QR") return "Mi QR de pago";
    if (pm.bankName) return pm.bankName;
    return pm.type;
  }

  function addressDisplay() {
    const parts = [settings?.address, settings?.city].filter(Boolean);
    return parts.join(", ") || "Sin dirección";
  }

  const preferredPM =
    settings?.paymentMethods.find((m) => m.type === "QR") ?? settings?.paymentMethods[0];

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-sm">

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 bg-violet-700 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => router.back()} aria-label="Volver"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-violet-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
            </button>
            <h1 className="text-base font-semibold">Mi Tienda</h1>
            <AdminMenuDropdown />
          </div>
        </header>

        {/* ── Contenido ──────────────────────────────────────── */}
        <main className="flex-1 pb-24">
          {sessionInvalid && <div className="p-4"><EmptyState title="Sesion no valida" description="Inicia sesion nuevamente." /></div>}
          {!sessionInvalid && isLoading && <div className="p-4"><LoadingState text="Cargando configuración..." /></div>}
          {!sessionInvalid && !isLoading && !settings && error && <div className="p-4"><EmptyState title="Error" description={error} /></div>}

          {!sessionInvalid && !isLoading && settings && (
            <>
              {success && (
                <p className="mx-4 mt-3 rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-700">{success}</p>
              )}
              {error && (
                <p className="mx-4 mt-3 rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p>
              )}

              {/* ── Sección: Datos del propietario ──────────── */}
              <p className="px-4 pt-5 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Datos del propietario
              </p>
              <div className="px-4 py-1 space-y-3 pb-3">
                <ReadOnlyRow
                  label="Nombre"
                  value={[settings.owner.firstName, settings.owner.lastName].filter(Boolean).join(" ") || "Sin nombre"}
                />
                <ReadOnlyRow
                  label="Correo electrónico"
                  value={settings.owner.email || "Sin correo"}
                />
                <ReadOnlyRow
                  label="Teléfono"
                  value={settings.owner.phoneNumber || "Sin teléfono"}
                />
              </div>
              <p className="px-4 mx-0 text-[10px] text-zinc-400 pb-3">
                Para cambiar estos datos contacta al soporte.
              </p>

              <Divider />

              {/* ── Sección: Datos de la tienda ──────────────── */}
              <p className="px-4 pt-5 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Datos de la tienda
              </p>

              {/* Logo + nombre */}
              <div className="flex items-center gap-3 px-4 py-3">
                <label className="relative shrink-0 cursor-pointer" title="Cambiar logo">
                  {settings.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={settings.logoUrl}
                      alt="Logo"
                      className="h-14 w-14 rounded-full border-2 border-violet-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-lg font-bold text-white">
                      {settings.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUploadLogo} />
                </label>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-zinc-900">{settings.name}</p>
                  <p className="truncate text-xs text-zinc-400">{settings.description || "Sin descripción"}</p>
                </div>
                <EditButton onClick={() => openEdit("name")} />
              </div>
              {editSection === "name" && (
                <InlineEdit
                  label="Nombre de tienda"
                  value={nameVal}
                  onChange={setNameVal}
                  onSave={() => saveField("name")}
                  onCancel={cancelEdit}
                  isSaving={isSaving}
                />
              )}

              <Divider />

              {/* WhatsApp */}
              <SettingsRow
                label="WhatsApp de contacto"
                value={settings.whatsapp || "Sin número"}
                onEdit={() => openEdit("whatsapp")}
              />
              {editSection === "whatsapp" && (
                <InlineEdit
                  label="WhatsApp"
                  value={whatsappVal}
                  onChange={setWhatsappVal}
                  onSave={() => saveField("whatsapp")}
                  onCancel={cancelEdit}
                  isSaving={isSaving}
                />
              )}

              <Divider />

              {/* Descripción */}
              <SettingsRow
                label="Descripción de tu tienda"
                value={settings.description || "Sin descripción"}
                onEdit={() => openEdit("description")}
              />
              {editSection === "description" && (
                <InlineEdit
                  label="Descripción"
                  value={descriptionVal}
                  onChange={setDescriptionVal}
                  onSave={() => saveField("description")}
                  onCancel={cancelEdit}
                  isSaving={isSaving}
                  multiline
                />
              )}

              <Divider />

              {/* ── Sección: Método de pago ──────────────────── */}
              <p className="px-4 pt-5 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Método de pago
              </p>

              {/* Medios de pago */}
              <SettingsRow
                label="Método actual"
                value={paymentSummary(preferredPM)}
                editLabel="Ver / Editar"
                onEdit={() => openEdit("payment")}
              />
              {editSection === "payment" && (
                <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-3 space-y-3">
                  <p className="text-xs font-medium text-zinc-500">Método de pago</p>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-700">Tipo</label>
                    <select
                      value={payment.type}
                      onChange={(e) => setPayment((p) => ({ ...p, type: e.target.value as UpdatePaymentMethodPayload["type"] }))}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-violet-300 focus:ring-2"
                    >
                      <option value="QR">QR</option>
                      <option value="TRANSFERENCIA">Transferencia</option>
                      <option value="YAPE">Yape</option>
                      <option value="TIGO_MONEY">Tigo Money</option>
                      <option value="EFECTIVO">Efectivo</option>
                    </select>
                  </div>
                  {(payment.type === "QR" || payment.type === "TRANSFERENCIA") && (
                    <>
                      <InlineField label="Banco" value={payment.bankName ?? ""} onChange={(v) => setPayment((p) => ({ ...p, bankName: v }))} />
                      <InlineField label="Titular" value={payment.accountHolder ?? ""} onChange={(v) => setPayment((p) => ({ ...p, accountHolder: v }))} />
                      <InlineField label="Número de cuenta" value={payment.accountNumber ?? ""} onChange={(v) => setPayment((p) => ({ ...p, accountNumber: v }))} />
                    </>
                  )}
                  {payment.type === "QR" && (
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-zinc-700">Imagen QR</p>
                      {payment.qrImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={payment.qrImageUrl}
                          alt="QR de pago"
                          className="mb-2 h-28 w-28 rounded-xl border border-zinc-200 object-contain bg-white"
                        />
                      ) : (
                        <div className="mb-2 flex h-28 w-28 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white text-xs text-zinc-400">
                          Sin QR
                        </div>
                      )}
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 active:bg-zinc-100 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleUploadQr}
                        />
                        Subir imagen QR
                      </label>
                    </div>
                  )}
                  <SaveCancelRow onSave={savePayment} onCancel={cancelEdit} isSaving={isSaving} />
                </div>
              )}

              <Divider />

              {/* Dirección */}
              <SettingsRow
                label="Dirección"
                value={addressDisplay()}
                onEdit={() => openEdit("address")}
              />
              {editSection === "address" && (
                <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-3 space-y-2">
                  <InlineField label="Dirección" value={addressVal} onChange={setAddressVal} />
                  <InlineField label="Ciudad" value={cityVal} onChange={setCityVal} />
                  <SaveCancelRow onSave={() => saveField("address")} onCancel={cancelEdit} isSaving={isSaving} />
                </div>
              )}

              <Divider />

              {/* ── Sección: Acciones ────────────────────────── */}
              <p className="px-4 pt-5 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Acciones
              </p>

              {/* Notificaciones */}
              <div className="flex items-center justify-between px-4 py-4">
                <p className="text-sm font-semibold text-zinc-900">Notificaciones</p>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationsVal}
                  onClick={() => handleToggleNotifications(!notificationsVal)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    notificationsVal ? "bg-emerald-500" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      notificationsVal ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <Divider />

              {/* Ingresar como cliente */}
              <div className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Ingresar como cliente</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Explora tiendas y productos como comprador.</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="shrink-0 rounded-xl bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100 active:bg-violet-200 transition-colors"
                >
                  Ir
                </button>
              </div>

              <Divider />

              {/* Cerrar sesión */}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="w-full px-4 py-4 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 active:bg-rose-100"
              >
                Cerrar sesión
              </button>
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

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function Divider() {
  return <div className="mx-4 border-t border-zinc-100" />;
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-zinc-900">{value}</p>
    </div>
  );
}

function EditButton({ onClick, label = "Editar" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick}
      className="shrink-0 text-sm font-medium text-violet-600 hover:text-violet-800">
      {label}
    </button>
  );
}

function SettingsRow({
  label,
  value,
  editLabel = "Editar",
  onEdit,
}: {
  label: string;
  value: string;
  editLabel?: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium leading-snug text-zinc-900">{value}</p>
      </div>
      <EditButton onClick={onEdit} label={editLabel} />
    </div>
  );
}

function InlineEdit({
  label,
  value,
  onChange,
  onSave,
  onCancel,
  isSaving,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  multiline?: boolean;
}) {
  return (
    <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-3 space-y-2">
      <label className="block text-xs font-medium text-zinc-500">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-violet-300 focus:ring-2"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-violet-300 focus:ring-2"
        />
      )}
      <SaveCancelRow onSave={onSave} onCancel={onCancel} isSaving={isSaving} />
    </div>
  );
}

function InlineField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-zinc-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-violet-300 focus:ring-2"
      />
    </div>
  );
}

function SaveCancelRow({
  onSave,
  onCancel,
  isSaving,
}: {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="flex gap-2 pt-1">
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="flex-1 rounded-xl bg-violet-700 py-2 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:opacity-60"
      >
        {isSaving ? "Guardando..." : "Guardar"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100"
      >
        Cancelar
      </button>
    </div>
  );
}
