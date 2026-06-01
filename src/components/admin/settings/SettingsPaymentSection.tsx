import type { ChangeEvent } from "react";
import type { StorePaymentMethod, UpdatePaymentMethodPayload } from "@/types/admin";
import { SectionTitle, SettingsRow, InlineField, SaveCancelRow } from "./SettingsUI";

interface Props {
  preferredPM?: StorePaymentMethod;
  payment: UpdatePaymentMethodPayload;
  isOpen: boolean;
  isSaving: boolean;
  onOpen: () => void;
  onCancel: () => void;
  onSave: () => void;
  onPaymentChange: (p: UpdatePaymentMethodPayload) => void;
  onUploadQr: (e: ChangeEvent<HTMLInputElement>) => void;
}

function paymentSummary(pm?: StorePaymentMethod) {
  if (!pm) return "Sin método de pago";
  if (pm.type === "QR") return "Mi QR de pago";
  if (pm.bankName) return pm.bankName;
  return pm.type;
}

export default function SettingsPaymentSection({
  preferredPM, payment, isOpen, isSaving,
  onOpen, onCancel, onSave, onPaymentChange, onUploadQr,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <SectionTitle>Método de pago</SectionTitle>
      <SettingsRow
        label="Método actual"
        value={paymentSummary(preferredPM)}
        editLabel="Ver / Editar"
        onEdit={onOpen}
      />

      {isOpen && (
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3 mt-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tipo</label>
            <select
              value={payment.type}
              onChange={(e) => onPaymentChange({ ...payment, type: e.target.value as UpdatePaymentMethodPayload["type"] })}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
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
              <InlineField label="Banco" value={payment.bankName ?? ""}
                onChange={(v) => onPaymentChange({ ...payment, bankName: v })} />
              <InlineField label="Titular" value={payment.accountHolder ?? ""}
                onChange={(v) => onPaymentChange({ ...payment, accountHolder: v })} />
              <InlineField label="Número de cuenta" value={payment.accountNumber ?? ""}
                onChange={(v) => onPaymentChange({ ...payment, accountNumber: v })} />
            </>
          )}

          {payment.type === "QR" && (
            <div>
              <p className="mb-2 text-xs font-medium text-gray-600">Imagen QR</p>
              {payment.qrImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={payment.qrImageUrl} alt="QR de pago"
                  className="mb-3 h-28 w-28 rounded-xl border border-gray-200 object-contain bg-white" />
              ) : (
                <div className="mb-3 flex h-28 w-28 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-xs text-gray-400">
                  Sin QR
                </div>
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={onUploadQr} />
                Subir imagen QR
              </label>
            </div>
          )}

          <SaveCancelRow onSave={onSave} onCancel={onCancel} isSaving={isSaving} />
        </div>
      )}
    </div>
  );
}
