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
import {
  addSocialLink,
  deleteSocialLink,
  getStoreSettings,
  updateSocialLink,
  updateStorePaymentMethod,
  updateStoreSettings,
  uploadStoreImage,
} from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { StoreSettings, UpdatePaymentMethodPayload } from "@/types/admin";

type EditSection = "name" | "whatsapp" | "description" | "address" | "payment" | null;

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const token = session?.user.backendToken;
  const sessionInvalid = status !== "loading" && !token;

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [socialLinks, setSocialLinks] = useState<StoreSettings["socialLinks"]>([]);
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
  const [payment, setPayment] = useState<UpdatePaymentMethodPayload>({
    type: "QR", bankName: "", accountHolder: "", accountNumber: "", qrImageUrl: "", qrImagePublicId: "",
  });

  useEffect(() => {
    if (status === "loading" || !token) return;
    getStoreSettings({ token })
      .then((store) => { setSettings(store); syncFromStore(store); })
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
    const pm = store.paymentMethods.find((m) => m.type === "QR") ?? store.paymentMethods[0];
    if (pm) setPayment({ id: pm.id, type: pm.type, bankName: pm.bankName ?? "", accountHolder: pm.accountHolder ?? "", accountNumber: pm.accountNumber ?? "", qrImageUrl: pm.qrImageUrl ?? "", qrImagePublicId: pm.qrImagePublicId ?? "" });
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

  async function savePayment() {
    if (!token) return;
    setIsSaving(true); setError(null); setSuccess(null);
    try {
      await updateStorePaymentMethod(payment, { token });
      const refreshed = await getStoreSettings({ token });
      setSettings(refreshed); syncFromStore(refreshed);
      setSuccess("Método de pago actualizado."); setEditSection(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar el método de pago.");
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

  async function handleUploadQr(e: ChangeEvent<HTMLInputElement>) {
    if (!token || !e.target.files?.[0]) return;
    setError(null); setSuccess(null);
    try {
      const uploaded = await uploadStoreImage(e.target.files[0], "qr", { token });
      setPayment((p) => ({ ...p, qrImageUrl: uploaded.url, qrImagePublicId: uploaded.publicId }));
      setSuccess("QR cargado. Presiona Guardar para confirmar.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo subir el QR.");
    } finally { e.target.value = ""; }
  }

  const preferredPM = settings?.paymentMethods.find((m) => m.type === "QR") ?? settings?.paymentMethods[0];

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
            preferredPM={preferredPM}
            payment={payment}
            isOpen={editSection === "payment"}
            isSaving={isSaving}
            onOpen={() => openEdit("payment")}
            onCancel={cancelEdit}
            onSave={savePayment}
            onPaymentChange={setPayment}
            onUploadQr={handleUploadQr}
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
