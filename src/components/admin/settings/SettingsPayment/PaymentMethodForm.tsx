import { useState, type ChangeEvent } from "react"
import { Loader2, Check, X } from "lucide-react"
import type { UpdatePaymentMethodPayload } from "@/types/admin"
import { InlineField } from "../SettingsUI"
import PaymentTypeSelector from "./PaymentTypeSelector"
import type { PaymentType } from "./paymentConfig"

const NEEDS_BANK = ["QR", "TRANSFERENCIA"] as const
const NEEDS_PHONE = ["YAPE", "TIGO_MONEY"] as const

function makeEmpty(disabledTypes: PaymentType[]): UpdatePaymentMethodPayload {
  const firstAvailable = (["QR", "TRANSFERENCIA", "YAPE", "TIGO_MONEY", "EFECTIVO"] as const)
    .find((t) => !disabledTypes.includes(t)) ?? "QR"
  return { type: firstAvailable, bankName: "", accountHolder: "", accountNumber: "", qrImageUrl: "", qrImagePublicId: "", phoneNumber: "" }
}

interface Props {
  initial?: UpdatePaymentMethodPayload
  isSaving: boolean
  disabledTypes?: import("./paymentConfig").PaymentType[]
  onSave: (dto: UpdatePaymentMethodPayload) => Promise<void>
  onCancel: () => void
  onUploadQr: (e: ChangeEvent<HTMLInputElement>, onChange: (url: string, id: string) => void) => void
}

export default function PaymentMethodForm({ initial, isSaving, disabledTypes = [], onSave, onCancel, onUploadQr }: Props) {
  const [form, setForm] = useState<UpdatePaymentMethodPayload>(() => initial ?? makeEmpty(disabledTypes))

  const set = <K extends keyof UpdatePaymentMethodPayload>(k: K, v: UpdatePaymentMethodPayload[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const needsBank = NEEDS_BANK.includes(form.type as typeof NEEDS_BANK[number])
  const needsPhone = NEEDS_PHONE.includes(form.type as typeof NEEDS_PHONE[number])

  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3">
      <PaymentTypeSelector value={form.type as PaymentType} onChange={(v) => set("type", v)} disabledTypes={disabledTypes} />

      {needsBank && (
        <>
          <InlineField label="Banco" value={form.bankName ?? ""} onChange={(v) => set("bankName", v)} />
          <InlineField label="Titular de la cuenta" value={form.accountHolder ?? ""} onChange={(v) => set("accountHolder", v)} />
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Número de cuenta</label>
            <input
              value={(form.accountNumber ?? "").replace(/(.{4})/g, "$1 ").trimEnd()}
              onChange={(e) => {
                const raw = e.target.value.replace(/\s/g, "")
                set("accountNumber", raw)
              }}
              placeholder="0000 0000 0000 0000"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-violet-300 tracking-widest"
            />
          </div>
        </>
      )}

      {needsPhone && (
        <>
          <InlineField
            label="Número de teléfono"
            value={form.phoneNumber ?? ""}
            onChange={(v) => set("phoneNumber", v)}
          />
          <div>
            <p className="mb-1 text-xs font-medium text-gray-600">Imagen QR <span className="font-normal text-gray-400">(opcional)</span></p>
            {form.qrImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.qrImageUrl} alt="QR" className="mb-3 h-28 w-28 rounded-xl border border-gray-200 object-contain bg-white" />
            ) : (
              <div className="mb-3 flex h-28 w-28 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-xs text-gray-400">
                Sin QR
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onUploadQr(e, (url, id) => setForm((f) => ({ ...f, qrImageUrl: url, qrImagePublicId: id })))}
              />
              Subir imagen QR
            </label>
          </div>
        </>
      )}

      {form.type === "QR" && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-600">Imagen QR</p>
          {form.qrImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.qrImageUrl} alt="QR" className="mb-3 h-28 w-28 rounded-xl border border-gray-200 object-contain bg-white" />
          ) : (
            <div className="mb-3 flex h-28 w-28 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-xs text-gray-400">
              Sin QR
            </div>
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUploadQr(e, (url, id) => setForm((f) => ({ ...f, qrImageUrl: url, qrImagePublicId: id })))}
            />
            Subir imagen QR
          </label>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave(form)}
          disabled={isSaving}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {isSaving ? "Guardando..." : "Guardar"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
