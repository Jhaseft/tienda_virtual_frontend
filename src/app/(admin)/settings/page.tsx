"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminShell from "@/components/admin/home/AdminShell";
import AdminMenuDropdown from "@/components/admin/home/AdminMenuDropdown";
import EmptyState from "@/components/admin/home/EmptyState";
import LoadingState from "@/components/admin/home/LoadingState";
import PageFooterHint from "@/components/ui/PageFooterHint";
import SettingsOwnerSection from "@/components/admin/settings/SettingsOwnerSection";
import SettingsStoreSection from "@/components/admin/settings/SettingsStoreSection";
import SettingsPaymentSection from "@/components/admin/settings/SettingsPaymentSection";
import SettingsActionsSection from "@/components/admin/settings/SettingsActionsSection";
import SettingsSocialSection from "@/components/admin/settings/SettingsSocialSection";
import SettingsShippingSection from "@/components/admin/settings/SettingsShippingSection";
import {
  addSocialLink,
  deleteSocialLink,
  getStoreSettings,
  updateSocialLink,
  updateStorePaymentMethod,
  createPaymentMethod,
  deletePaymentMethod,
  updateStoreSettings,
  uploadStoreImage,
} from "@/lib/api/admin";
import {
  getShippingZones,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone,
} from "@/lib/api/shippingZones";
import { ApiError } from "@/lib/api/client";
import type { StoreSettings, StorePaymentMethod, UpdatePaymentMethodPayload } from "@/types/admin";
import type { ShippingZone, CreateShippingZonePayload } from "@/types/shippingZone";

type EditSection = "name" | "whatsapp" | "description" | "address" | null;

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const token = session?.user.backendToken;
  const sessionInvalid = status !== "loading" && !token;

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [socialLinks, setSocialLinks] = useState<StoreSettings["socialLinks"]>([]);
  const [paymentMethods, setPaymentMethods] = useState<StorePaymentMethod[]>([]);
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editSection, setEditSection] = useState<EditSection>(null);

  const [nameVal, setNameVal] = useState("");
  const [whatsappVal, setWhatsappVal] = useState("");
  const [descriptionVal, setDescriptionVal] = useState("");
  const [addressVal, setAddressVal] = useState("");
  const [cityVal, setCityVal] = useState("");
  const [notificationsVal, setNotificationsVal] = useState(true);

  useEffect(() => {
    if (status === "loading" || !token) return;
    Promise.all([
      getStoreSettings({ token }),
      getShippingZones({ token }),
    ])
      .then(([store, fetchedZones]) => {
        setSettings(store);
        syncFromStore(store);
        setZones(fetchedZones);
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "No se pudo cargar la configuración.");
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
    setSocialLinks(store.socialLinks ?? []);
    setPaymentMethods(store.paymentMethods ?? []);
  }

  function openEdit(section: EditSection) { setEditSection(section); setError(null); setSuccess(null); }
  function cancelEdit() { if (settings) syncFromStore(settings); setEditSection(null); setError(null); }

  async function saveField(section: "name" | "whatsapp" | "description" | "address") {
    if (!token) return;
    setIsSaving(true); setError(null); setSuccess(null);
    try {
      const payload = section === "name" ? { name: nameVal }
        : section === "whatsapp" ? { whatsapp: whatsappVal }
        : section === "description" ? { description: descriptionVal }
        : { address: addressVal, city: cityVal };
      const updated = await updateStoreSettings(payload, { token });
      setSettings(updated); syncFromStore(updated);
      setSuccess("Guardado correctamente."); setEditSection(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar.");
    } finally { setIsSaving(false); }
  }

  async function handleToggleNotifications(checked: boolean) {
    if (!token) return;
    setNotificationsVal(checked);
    try {
      const updated = await updateStoreSettings({ notificationsEnabled: checked }, { token });
      setSettings(updated);
    } catch { setNotificationsVal(!checked); }
  }

  async function handleUploadLogo(e: ChangeEvent<HTMLInputElement>) {
    if (!token || !e.target.files?.[0]) return;
    setError(null); setSuccess(null);
    try {
      const uploaded = await uploadStoreImage(e.target.files[0], "logo", { token });
      const updated = await updateStoreSettings({ logoUrl: uploaded.url, logoPublicId: uploaded.publicId }, { token });
      setSettings(updated); syncFromStore(updated); setSuccess("Logo actualizado.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo subir el logo.");
    } finally { e.target.value = ""; }
  }

  // — Métodos de pago —
  async function handleCreatePayment(dto: UpdatePaymentMethodPayload) {
    if (!token) return;
    setIsSaving(true); setError(null);
    try {
      await createPaymentMethod(dto, { token });
      const refreshed = await getStoreSettings({ token });
      setPaymentMethods(refreshed.paymentMethods ?? []);
      setSuccess("Método de pago agregado.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo agregar el método de pago.");
    } finally { setIsSaving(false); }
  }

  async function handleUpdatePayment(id: string, dto: UpdatePaymentMethodPayload) {
    if (!token) return;
    setIsSaving(true); setError(null);
    try {
      const updated = await updateStorePaymentMethod({ ...dto, id }, { token });
      setPaymentMethods((prev) => prev.map((m) => (m.id === id ? updated : m)));
      setSuccess("Método de pago actualizado.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo actualizar el método de pago.");
    } finally { setIsSaving(false); }
  }

  async function handleDeletePayment(id: string) {
    if (!token) return;
    try {
      await deletePaymentMethod(id, { token });
      setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
      setSuccess("Método de pago eliminado.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo eliminar el método de pago.");
    }
  }

  async function handleUploadQr(e: ChangeEvent<HTMLInputElement>, onChange: (url: string, id: string) => void) {
    if (!token || !e.target.files?.[0]) return;
    setError(null);
    try {
      const uploaded = await uploadStoreImage(e.target.files[0], "qr", { token });
      onChange(uploaded.url, uploaded.publicId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo subir el QR.");
    } finally { e.target.value = ""; }
  }

  // — Redes sociales —
  async function handleAddSocialLink(network: import("@/types/admin").SocialNetwork, url: string) {
    if (!token) return;
    setError(null); setSuccess(null);
    try {
      const link = await addSocialLink({ network, url }, { token });
      setSocialLinks((prev) => [...prev, link]);
      setSuccess("Red social agregada.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo agregar la red social.");
    }
  }

  async function handleUpdateSocialLink(id: string, network: import("@/types/admin").SocialNetwork, url: string) {
    if (!token) return;
    setError(null); setSuccess(null);
    try {
      const updated = await updateSocialLink(id, { network, url }, { token });
      setSocialLinks((prev) => prev.map((l) => (l.id === id ? updated : l)));
      setSuccess("Red social actualizada.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo actualizar la red social.");
    }
  }

  async function handleDeleteSocialLink(id: string) {
    if (!token) return;
    setError(null); setSuccess(null);
    try {
      await deleteSocialLink(id, { token });
      setSocialLinks((prev) => prev.filter((l) => l.id !== id));
      setSuccess("Red social eliminada.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo eliminar la red social.");
    }
  }

  // — Zonas de envío —
  async function handleCreateZone(dto: CreateShippingZonePayload) {
    if (!token) return;
    setIsSaving(true); setError(null);
    try {
      const created = await createShippingZone(dto, { token });
      setZones((prev) => [...prev, created]);
      setSuccess("Zona de envío agregada.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo agregar la zona.");
    } finally { setIsSaving(false); }
  }

  async function handleUpdateZone(id: string, dto: Partial<CreateShippingZonePayload & { isActive: boolean }>) {
    if (!token) return;
    setIsSaving(true); setError(null);
    try {
      const updated = await updateShippingZone(id, dto, { token });
      setZones((prev) => prev.map((z) => (z.id === id ? updated : z)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo actualizar la zona.");
    } finally { setIsSaving(false); }
  }

  async function handleDeleteZone(id: string) {
    if (!token) return;
    try {
      await deleteShippingZone(id, { token });
      setZones((prev) => prev.filter((z) => z.id !== id));
      setSuccess("Zona de envío eliminada.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo eliminar la zona.");
    }
  }

  return (
    <AdminShell title="Mi tienda" subtitle="Configura tu tienda" rightSlot={<AdminMenuDropdown />}>
      {sessionInvalid && <EmptyState title="Sesión no válida" description="Inicia sesión nuevamente." />}
      {!sessionInvalid && isLoading && <LoadingState text="Cargando configuración..." />}
      {!sessionInvalid && !isLoading && !settings && error && <EmptyState title="Error" description={error} />}

      {!sessionInvalid && !isLoading && settings && (
        <div className="space-y-4">
          {success && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">{success}</div>
          )}
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>
          )}

          <SettingsOwnerSection owner={settings.owner} />

          <SettingsStoreSection
            settings={settings}
            editSection={editSection as "name" | "whatsapp" | "description" | "address" | null}
            nameVal={nameVal} whatsappVal={whatsappVal} descriptionVal={descriptionVal}
            addressVal={addressVal} cityVal={cityVal} isSaving={isSaving}
            onOpenEdit={(s) => openEdit(s)}
            onCancelEdit={cancelEdit}
            onSaveField={saveField}
            onNameChange={setNameVal} onWhatsappChange={setWhatsappVal}
            onDescriptionChange={setDescriptionVal} onAddressChange={setAddressVal}
            onCityChange={setCityVal} onUploadLogo={handleUploadLogo}
          />

          <SettingsPaymentSection
            methods={paymentMethods}
            isSaving={isSaving}
            onCreate={handleCreatePayment}
            onUpdate={handleUpdatePayment}
            onDelete={handleDeletePayment}
            onUploadQr={handleUploadQr}
          />

          <SettingsShippingSection
            zones={zones}
            isSaving={isSaving}
            onCreate={handleCreateZone}
            onUpdate={handleUpdateZone}
            onDelete={handleDeleteZone}
          />

          <SettingsSocialSection
            links={socialLinks}
            isSaving={isSaving}
            onAdd={handleAddSocialLink}
            onUpdate={handleUpdateSocialLink}
            onDelete={handleDeleteSocialLink}
          />

          <SettingsActionsSection
            notificationsEnabled={notificationsVal}
            onToggleNotifications={handleToggleNotifications}
          />
        </div>
      )}

      <PageFooterHint message="Mantén tu tienda siempre actualizada" />
    </AdminShell>
  );
}
