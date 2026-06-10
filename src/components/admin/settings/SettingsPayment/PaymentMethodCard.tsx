import { Check } from "lucide-react"
import type { ChangeEvent } from "react"
import type { StorePaymentMethod, UpdatePaymentMethodPayload } from "@/types/admin"
import { PAYMENT_CONFIG } from "./paymentConfig"
import PaymentMethodForm from "./PaymentMethodForm"

export type PaymentCardMode = "normal" | "deleting" | "editing"

interface Props {
  method: StorePaymentMethod
  mode: PaymentCardMode
  selected: boolean
  isEditingInline: boolean
  isSaving: boolean
  onToggleSelect: () => void
  onEditSave: (dto: UpdatePaymentMethodPayload) => Promise<void>
  onEditCancel: () => void
  onUploadQr: (e: ChangeEvent<HTMLInputElement>, onChange: (url: string, id: string) => void) => void
}

export default function PaymentMethodCard({
  method, mode, selected, isEditingInline, isSaving,
  onToggleSelect, onEditSave, onEditCancel, onUploadQr,
}: Props) {
  const { label, Icon, color, bg } = PAYMENT_CONFIG[method.type]
  const isDeleting = mode === "deleting"
  const isEditing  = mode === "editing"

  if (isEditingInline) {
    return (
      <PaymentMethodForm
        initial={{
          id: method.id,
          type: method.type,
          bankName: method.bankName ?? "",
          accountHolder: method.accountHolder ?? "",
          accountNumber: method.accountNumber ?? "",
          qrImageUrl: method.qrImageUrl ?? "",
          qrImagePublicId: method.qrImagePublicId ?? "",
          phoneNumber: method.phoneNumber ?? "",
        }}
        isSaving={isSaving}
        onSave={onEditSave}
        onCancel={onEditCancel}
        onUploadQr={onUploadQr}
      />
    )
  }

  const cardClass = isDeleting && selected
    ? "border border-red-300 bg-red-50 rounded-2xl"
    : isDeleting
    ? "border border-dashed border-gray-200 bg-white rounded-2xl hover:border-red-300"
    : isEditing
    ? "border border-violet-200 bg-white rounded-2xl hover:border-violet-400 hover:shadow-md cursor-pointer"
    : "border border-gray-100 bg-white rounded-2xl shadow-sm"

  return (
    <div
      className={`flex gap-3 px-4 py-3.5 transition-all duration-200 ${cardClass}`}
      onClick={(isDeleting || isEditing) ? onToggleSelect : undefined}
    >
      {isDeleting && (
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
          selected ? "bg-red-500 border-red-500" : "border-gray-300"
        }`}>
          {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
      )}

      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDeleting && selected ? "bg-red-100" : bg}`}>
        <Icon className={`w-5 h-5 ${isDeleting && selected ? "text-red-500" : color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          {method.qrImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={method.qrImageUrl} alt="QR" className="h-8 w-8 rounded-lg border border-gray-200 object-contain bg-white shrink-0" />
          )}
        </div>

        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
          {method.bankName && (
            <p className="text-xs text-gray-400"><span className="font-medium text-gray-500">Banco</span> · {method.bankName}</p>
          )}
          {method.accountHolder && (
            <p className="text-xs text-gray-400"><span className="font-medium text-gray-500">Titular</span> · {method.accountHolder}</p>
          )}
          {method.accountNumber && (
            <p className="text-xs text-gray-400 font-mono">{method.accountNumber}</p>
          )}
          {method.phoneNumber && (
            <p className="text-xs text-gray-400"><span className="font-medium text-gray-500">Tel</span> · {method.phoneNumber}</p>
          )}
          {!method.bankName && !method.accountHolder && !method.accountNumber && !method.qrImageUrl && !method.phoneNumber && (
            <p className="text-xs text-gray-400 italic">Sin detalles</p>
          )}
        </div>
      </div>
    </div>
  )
}
