'use client'

import { useRef, useState } from 'react'
import { Loader2, CheckCircle2, Upload, X, FileImage, MessageCircle, Banknote, ArrowRight } from 'lucide-react'
import type { PaymentMethod } from '@/types/explorar'
import { createPedido, uploadVoucher } from '@/app/(explorarTienda)/api/checkout.api'
import type { PaymentType } from '@/types/explorar'
import type { CreatePedidoPayload } from '@/app/(explorarTienda)/api/checkout.api'

interface Props {
  payload: Omit<CreatePedidoPayload, 'paymentMethod'> & { paymentMethod: PaymentType }
  paymentMethod: PaymentType
  methods: PaymentMethod[]
  storeWhatsapp: string | null
  token: string
  onClose: () => void
  onSuccess: (orderId: string) => void
}

const NEEDS_VOUCHER: PaymentType[] = ['TRANSFERENCIA', 'QR', 'YAPE', 'TIGO_MONEY']

const METHOD_CONFIG: Record<string, { label: string }> = {
  TRANSFERENCIA: { label: 'Transferencia bancaria' },
  QR:            { label: 'QR / Billetera digital' },
  YAPE:          { label: 'Yape' },
  TIGO_MONEY:    { label: 'Tigo Money' },
  EFECTIVO:      { label: 'Pago en efectivo' },
  WHATSAPP:      { label: 'Coordinar por WhatsApp' },
}

export default function VoucherPanel({ payload, paymentMethod, methods, storeWhatsapp, token, onClose, onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const needsVoucher = NEEDS_VOUCHER.includes(paymentMethod)
  const selectedMethod = methods.find((m) => m.type === paymentMethod)
  const cfg = METHOD_CONFIG[paymentMethod]

  const handleFileChange = (f: File | null) => {
    setFile(f)
    if (f && f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }

  const handleConfirm = async () => {
    if (needsVoucher && !file) return
    setSubmitting(true)
    setError(null)
    try {
      const pedido = await createPedido(token, {
        ...payload,
        paymentMethod,
      })
      if (needsVoucher && file) {
        await uploadVoucher(token, pedido.id, file)
      }
      // Limpiar productos del carrito del localStorage para que el botón "Agregar al carrito" se resetee
      const productIds = payload.items.map((i) => i.productId)
      const saved = JSON.parse(localStorage.getItem('cart_added_products') ?? '[]') as string[]
      localStorage.setItem('cart_added_products', JSON.stringify(saved.filter((id) => !productIds.includes(id))))
      window.dispatchEvent(new Event('storage'))
      window.dispatchEvent(new Event('cart:refresh'))
      onSuccess(pedido.id)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error al procesar el pedido')
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Confirmar pedido</p>
              <p className="text-blue-100 text-xs">Último paso antes de finalizar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Datos de cuenta para métodos con voucher */}
          {needsVoucher && cfg && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{cfg.label}</p>
              {selectedMethod?.bankName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Banco</span>
                  <span className="font-semibold text-gray-800">{selectedMethod.bankName}</span>
                </div>
              )}
              {selectedMethod?.accountHolder && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Titular</span>
                  <span className="font-semibold text-gray-800">{selectedMethod.accountHolder}</span>
                </div>
              )}
              {selectedMethod?.accountNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Número de cuenta</span>
                  <span className="font-bold text-gray-900 tracking-wider">{selectedMethod.accountNumber}</span>
                </div>
              )}
              {selectedMethod?.qrImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedMethod.qrImageUrl}
                  alt="QR de pago"
                  className="w-36 h-36 object-contain mx-auto mt-2 rounded-xl border border-blue-100"
                />
              )}
            </div>
          )}

          {/* WhatsApp */}
          {paymentMethod === 'WHATSAPP' && (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Coordinar por WhatsApp</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  El vendedor te contactará para coordinar el pago y la entrega.
                  {storeWhatsapp && <> Número: <span className="font-semibold">{storeWhatsapp}</span></>}
                </p>
              </div>
            </div>
          )}

          {/* Efectivo */}
          {paymentMethod === 'EFECTIVO' && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <Banknote className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Pago en efectivo</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Coordina la entrega y el pago directamente con el vendedor al recibir tu pedido.
                </p>
              </div>
            </div>
          )}

          {/* Upload voucher */}
          {needsVoucher && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">Comprobante de pago</p>
                <span className="text-xs text-red-500 font-medium">Requerido</span>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />

              {file ? (
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  {preview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Vista previa" className="w-full h-36 object-cover" />
                  )}
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50">
                    <FileImage className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="text-xs text-gray-700 flex-1 truncate">{file.name}</span>
                    <button
                      onClick={() => handleFileChange(null)}
                      className="text-xs text-gray-400 hover:text-red-500 transition font-medium"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => inputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50 hover:bg-blue-50 rounded-2xl py-6 flex flex-col items-center gap-2 transition group"
                >
                  <div className="w-10 h-10 bg-white border border-gray-200 group-hover:border-blue-200 rounded-full flex items-center justify-center shadow-sm transition">
                    <Upload className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition" />
                  </div>
                  <p className="text-sm text-gray-500 group-hover:text-blue-600 transition font-medium">Seleccionar imagen</p>
                  <p className="text-xs text-gray-400">JPG, PNG o captura de pantalla</p>
                </button>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Botón confirmar */}
          <button
            onClick={handleConfirm}
            disabled={submitting || (needsVoucher && !file)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white disabled:text-gray-400 font-semibold py-3.5 rounded-full transition-all"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Procesando pedido...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Confirmar pedido <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          {needsVoucher && !file && (
            <p className="text-xs text-center text-gray-400">
              Sube tu comprobante para habilitar el botón
            </p>
          )}

        </div>
      </div>
    </div>
  )
}
