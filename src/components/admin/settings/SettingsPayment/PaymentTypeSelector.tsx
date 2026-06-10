import { PAYMENT_CONFIG, PAYMENT_TYPES, type PaymentType } from "./paymentConfig"

interface Props {
  value: PaymentType
  onChange: (v: PaymentType) => void
  disabledTypes?: PaymentType[]
}

export default function PaymentTypeSelector({ value, onChange, disabledTypes = [] }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">Tipo de pago</label>
      <div className="flex flex-wrap gap-2">
        {PAYMENT_TYPES.map((t) => {
          const { label, Icon } = PAYMENT_CONFIG[t]
          const active = value === t
          const disabled = disabledTypes.includes(t)
          return (
            <button
              key={t}
              type="button"
              onClick={() => !disabled && onChange(t)}
              disabled={disabled}
              title={disabled ? "Ya tienes este método agregado" : undefined}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                active
                  ? "bg-violet-600 border-violet-600 text-white shadow-sm"
                  : disabled
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-white border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
