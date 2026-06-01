import type { ChangeEvent } from "react";
import type { StoreSettings } from "@/types/admin";
import { SectionTitle, SettingsRow, InlineEdit, Divider, EditButton } from "./SettingsUI";

type EditSection = "name" | "whatsapp" | "description" | "address" | null;

interface Props {
  settings: StoreSettings;
  editSection: EditSection;
  nameVal: string;
  whatsappVal: string;
  descriptionVal: string;
  addressVal: string;
  cityVal: string;
  isSaving: boolean;
  onOpenEdit: (s: EditSection) => void;
  onCancelEdit: () => void;
  onSaveField: (s: "name" | "whatsapp" | "description" | "address") => void;
  onNameChange: (v: string) => void;
  onWhatsappChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onAddressChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onUploadLogo: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SettingsStoreSection({
  settings, editSection, nameVal, whatsappVal, descriptionVal,
  addressVal, cityVal, isSaving,
  onOpenEdit, onCancelEdit, onSaveField,
  onNameChange, onWhatsappChange, onDescriptionChange,
  onAddressChange, onCityChange, onUploadLogo,
}: Props) {
  const addressDisplay = [settings.address, settings.city].filter(Boolean).join(", ") || "Sin dirección";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-1">
      <SectionTitle>Datos de la tienda</SectionTitle>

      {/* Logo + nombre */}
      <div className="flex items-center gap-4 py-2">
        <label className="relative shrink-0 cursor-pointer group" title="Cambiar logo">
          {settings.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoUrl} alt="Logo"
              className="h-14 w-14 rounded-2xl border border-gray-100 object-cover shadow-sm" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-lg font-bold text-white shadow-sm">
              {settings.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-[10px] text-gray-500">✏️</span>
          <input type="file" accept="image/*" className="hidden" onChange={onUploadLogo} />
        </label>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{settings.name}</p>
          <p className="text-xs text-gray-400 truncate">{settings.description || "Sin descripción"}</p>
        </div>
        <EditButton onClick={() => onOpenEdit("name")} />
      </div>
      {editSection === "name" && (
        <InlineEdit label="Nombre de tienda" value={nameVal} onChange={onNameChange}
          onSave={() => onSaveField("name")} onCancel={onCancelEdit} isSaving={isSaving} />
      )}

      <Divider />
      <SettingsRow label="WhatsApp de contacto" value={settings.whatsapp || "Sin número"} onEdit={() => onOpenEdit("whatsapp")} />
      {editSection === "whatsapp" && (
        <InlineEdit label="WhatsApp" value={whatsappVal} onChange={onWhatsappChange}
          onSave={() => onSaveField("whatsapp")} onCancel={onCancelEdit} isSaving={isSaving} />
      )}

      <Divider />
      <SettingsRow label="Descripción" value={settings.description || "Sin descripción"} onEdit={() => onOpenEdit("description")} />
      {editSection === "description" && (
        <InlineEdit label="Descripción" value={descriptionVal} onChange={onDescriptionChange}
          onSave={() => onSaveField("description")} onCancel={onCancelEdit} isSaving={isSaving} multiline />
      )}

      <Divider />
      <SettingsRow label="Dirección" value={addressDisplay} onEdit={() => onOpenEdit("address")} />
      {editSection === "address" && (
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3 mt-1">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Dirección</label>
            <input value={addressVal} onChange={(e) => onAddressChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Ciudad</label>
            <input value={cityVal} onChange={(e) => onCityChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => onSaveField("address")} disabled={isSaving}
              className="flex-1 rounded-xl bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition-colors">
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" onClick={onCancelEdit}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
