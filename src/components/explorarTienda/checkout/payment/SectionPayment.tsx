'use client'

import React from 'react'
import { QrCode, Building2, Smartphone, Wallet, Banknote, MessageCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PaymentMethod } from '@/types/explorar'
import type { PaymentType } from '@/types/explorar'

interface Props {
  methods: PaymentMethod[]
  storeWhatsapp: string | null
  selected: PaymentType | null
  onSelect: (m: PaymentType | null) => void
}

const WHATSAPP_TYPE = 'WHATSAPP' as PaymentType

const METHOD_CONFIG: Record<string, { label: string; Icon: LucideIcon; color: string; bg: string }> = {
  QR:            { label: 'QR', Icon: QrCode,     color: 'text-violet-600', bg: 'bg-violet-50' },
  TRANSFERENCIA: { label: 'Transferencia bancaria', Icon: Building2,  color: 'text-blue-600',   bg: 'bg-blue-50'   },
  YAPE:          { label: 'Yape',                   Icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
  TIGO_MONEY:    { label: 'Tigo Money',             Icon: Wallet,     color: 'text-yellow-600', bg: 'bg-yellow-50' },
  EFECTIVO:      { label: 'Efectivo al recibir',    Icon: Banknote,   color: 'text-emerald-600',bg: 'bg-emerald-50'},
}

export default function SectionPayment({ methods, storeWhatsapp, selected, onSelect }: Props) {
  const hasNoMethods = methods.length === 0
  const showWhatsapp = !!storeWhatsapp

  if (hasNoMethods && !storeWhatsapp) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Pagar con</h2>
        <p className="text-sm text-gray-400">Esta tienda no ha configurado métodos de pago aún.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Pagar con</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Elige el método con el que realizarás el pago. Si no cuentas con ninguno, puedes <span className="font-medium text-gray-700">coordinar por WhatsApp</span> con el vendedor.
        </p>
      </div>

      <div className="px-6 py-2 flex flex-col gap-0">
        {showWhatsapp && (
          <PaymentRow
            isSelected={selected === WHATSAPP_TYPE}
            onChange={() => onSelect(selected === WHATSAPP_TYPE ? null : WHATSAPP_TYPE)}
            icon={<div className="text-green-600 bg-green-50 p-1.5 rounded-lg"><MessageCircle className="w-5 h-5" /></div>}
            label="Coordinar por WhatsApp"
          />
        )}

        {methods.map((m) => {
          const cfg = METHOD_CONFIG[m.type]
          if (!cfg) return null
          return (
            <PaymentRow
              key={m.id}
              isSelected={selected === m.type}
              onChange={() => onSelect(selected === m.type ? null : m.type as PaymentType)}
              icon={
                <div className={`${cfg.bg} ${cfg.color} p-1.5 rounded-lg`}>
                  <cfg.Icon className="w-5 h-5" />
                </div>
              }
              label={cfg.label}
            />
          )
        })}
      </div>
    </div>
  )
}

function PaymentRow({ isSelected, onChange, icon, label }: {
  isSelected: boolean
  onChange: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <div
      className="flex items-center gap-4 py-2.5 cursor-pointer"
      onClick={onChange}
    >
      <input
        type="radio"
        name="paymentMethod"
        checked={isSelected}
        onChange={onChange}
        className="accent-blue-600 shrink-0 pointer-events-none"
      />
      {icon}
      <p className="text-[16px] font-medium text-gray-900">{label}</p>
    </div>
  )
}
