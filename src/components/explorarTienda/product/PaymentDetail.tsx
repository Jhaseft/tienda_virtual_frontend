"use client"

import { useState } from "react"
import Image from "next/image"
import type { PaymentMethod } from "@/types/explorar"
import { MessageCircle } from "lucide-react"

interface Props {
  method: PaymentMethod
  onNotify: () => void
}

export default function PaymentDetail({ method, onNotify }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!method.accountNumber) return
    navigator.clipboard.writeText(method.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-5 pt-5 pb-6 flex flex-col gap-5">

      {method.qrImageUrl && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-500 font-semibold">Escanea el código QR</span>
          <div className="bg-white rounded-3xl p-4 shadow-md shadow-gray-100 border border-gray-100">
            <Image
              src={method.qrImageUrl}
              alt="QR de pago"
              width={300}
              height={300}
              className="object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {(method.bankName || method.accountHolder || method.accountNumber) && (
        <div className="flex flex-col gap-2">

          {method.bankName && (
            <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5">
              <span className="text-sm text-gray-500 font-medium">Banco</span>
              <span className="text-sm font-bold text-gray-800">{method.bankName}</span>
            </div>
          )}

          {method.accountHolder && (
            <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5">
              <span className="text-sm text-gray-500 font-medium">Titular</span>
              <span className="text-sm font-bold text-gray-800">{method.accountHolder}</span>
            </div>
          )}

          {method.accountNumber && (
            <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5">
              <span className="text-sm text-gray-500 font-medium">Número cuenta</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-800 font-mono tracking-wider">{method.accountNumber}</span>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${copied
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                    }`}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      <div className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-2xl px-4 py-3.5">
        <MessageCircle className="text-green-600 shrink-0" size={18} />
        <span className="text-sm text-green-700 font-medium">Envía el comprobante al vendedor por WhatsApp</span>
      </div>

      <button
        onClick={onNotify}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
      >
        <BellIcon />
        Ya pagué, avisar al vendedor
      </button>

    </div>
  )
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
