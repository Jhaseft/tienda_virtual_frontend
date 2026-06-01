import type { StoreSettings } from "@/types/admin";
import { SectionTitle, ReadOnlyRow, Divider } from "./SettingsUI";

interface Props {
  owner: StoreSettings["owner"];
}

export default function SettingsOwnerSection({ owner }: Props) {
  const fullName = [owner.firstName, owner.lastName].filter(Boolean).join(" ") || "Sin nombre";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
      <SectionTitle>Datos del propietario</SectionTitle>
      <ReadOnlyRow label="Nombre" value={fullName} />
      <Divider />
      <ReadOnlyRow label="Correo electrónico" value={owner.email || "Sin correo"} />
      <Divider />
      <ReadOnlyRow label="Teléfono" value={owner.phoneNumber || "Sin teléfono"} />
      <p className="text-[11px] text-gray-400 pt-1">
        Para cambiar estos datos contacta al soporte.
      </p>
    </div>
  );
}
