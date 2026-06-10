'use client'

import { ShieldCheck, Loader2 } from 'lucide-react'

interface Props {
  subtotal: number
  shippingCost: number
  total: number
  hasShippingZones: boolean
  canSubmit: boolean
  submitting: boolean
  error: string | null
  selectedPayment: string | null
  onConfirm: () => void
}

const PAYMENT_LABELS: Record<string, string> = {
  TRANSFERENCIA: 'Transferencia bancaria',
  QR:            'QR / Billetera digital',
  YAPE:          'Yape',
  TIGO_MONEY:    'Tigo Money',
  EFECTIVO:      'Efectivo al recibir',
  WHATSAPP:      'WhatsApp',
}

export default function CheckoutSidebar({
  subtotal,
  shippingCost,
  total,
  hasShippingZones,
  canSubmit,
  submitting,
  error,
  selectedPayment,
  onConfirm,
}: Props) {
  const hint = !canSubmit ? 'Selecciona una dirección y método de pago' : null
  const paymentLabel = selectedPayment ? PAYMENT_LABELS[selectedPayment] ?? selectedPayment : null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Resumen del pedido</h2>
      </div>

      <div className="px-6 py-4 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>Bs. {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Costo envío</span>
          {hasShippingZones ? (
            shippingCost === 0
              ? <span className="text-green-600 font-medium">Gratis</span>
              : <span>Bs. {shippingCost.toFixed(2)}</span>
          ) : (
            <span className="text-gray-400 italic text-xs">A definir con el vendedor</span>
          )}
        </div>
        <div className="border-t border-gray-100 pt-3">
          <div className="flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span>
            <span>Bs. {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-5 space-y-3">
        {paymentLabel && !submitting && (
          <p className="text-xs text-center text-gray-500">
            Vas a completar la transacción con{' '}
            <span className="font-semibold text-gray-700">{paymentLabel}</span>
          </p>
        )}
        <button
          onClick={onConfirm}
          disabled={!canSubmit || submitting}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Procesando...
            </>
          ) : paymentLabel ? (
            `Pagar con ${paymentLabel}`
          ) : (
            'Confirmar y pagar'
          )}
        </button>

        {hint && (
          <p className="text-xs text-center text-gray-400">{hint}</p>
        )}

        {error && (
          <p className="text-xs text-center text-red-500 font-medium">{error}</p>
        )}

        <div className="flex items-start gap-2 pt-1">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            Tu compra está protegida. El vendedor solo confirma al recibir el comprobante de pago.
          </p>
        </div>
      </div>
    </div>
  )
}
