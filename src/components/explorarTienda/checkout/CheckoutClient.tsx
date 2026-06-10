'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CartGroup } from '@/app/(explorarTienda)/api/carrito.api'
import type { Address } from '@/app/(explorarTienda)/api/addresses.api'
import type { PaymentMethod, PaymentType } from '@/types/explorar'
import type { ShippingZoneGroup, ShippingZoneOption } from '@/app/(explorarTienda)/api/public-explorarTienda.api'
import SectionPayment from './payment/SectionPayment'
import SectionAddress from './address/SectionAddress'
import SectionShipping from './SectionShipping'
import SectionReview from './SectionReview'
import CheckoutSidebar from './CheckoutSidebar'
import VoucherPanel from './VoucherPanel'

interface Props {
  group: CartGroup
  initialAddresses: Address[]
  paymentMethods: PaymentMethod[]
  shippingZones: ShippingZoneGroup[]
  storeWhatsapp: string | null
  token: string
  isDirect?: boolean
}

export default function CheckoutClient({ group, initialAddresses, paymentMethods, shippingZones, storeWhatsapp, token, isDirect = false }: Props) {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    initialAddresses.find((a) => a.isDefault)?.id ?? initialAddresses[0]?.id ?? null,
  )
  const [paymentMethod, setPaymentMethod] = useState<PaymentType | null>(null)
  const [selectedZone, setSelectedZone] = useState<ShippingZoneOption | null>(null)
  const [currentGroup, setCurrentGroup] = useState(group)
  const [note, setNote] = useState('')
  const [showPanel, setShowPanel] = useState(false)

  const shippingCost = selectedZone?.shippingCost ?? 0
  const subtotal = currentGroup.subtotal
  const total = subtotal + shippingCost
  const canSubmit = !!selectedAddressId && !!paymentMethod

  const isSpecialZone = selectedZone?.id === 'WHATSAPP' || selectedZone === null
  const pedidoPayload = {
    storeId: currentGroup.store.id,
    addressId: selectedAddressId ?? '',
    paymentMethod: paymentMethod!,
    shippingZoneId: isSpecialZone ? undefined : selectedZone?.id,
    pickupMethod: selectedZone?.id === 'WHATSAPP'
      ? 'WHATSAPP' as const
      : selectedZone === null
      ? 'STORE_PICKUP' as const
      : undefined,
    items: currentGroup.items.map((i) => ({
      productId: i.product.id,
      quantity: i.quantity,
      variant: i.variant ?? undefined,
      colorName: i.colorName ?? undefined,
    })),
    note: note.trim() || undefined,
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="flex-1 w-full space-y-2">
          <SectionPayment
            methods={paymentMethods}
            storeWhatsapp={storeWhatsapp}
            selected={paymentMethod}
            onSelect={(m) => setPaymentMethod(m)}
          />

          <SectionAddress
            addresses={addresses}
            selectedId={selectedAddressId}
            onSelect={setSelectedAddressId}
            onAddressCreated={(addr) => {
              setAddresses((prev) => [...prev, addr])
              setSelectedAddressId(addr.id)
            }}
            token={token}
          />

          <SectionShipping
            zones={shippingZones}
            selectedZoneId={selectedZone?.id ?? null}
            onSelect={setSelectedZone}
          />

          <SectionReview
            group={currentGroup}
            note={note}
            token={token}
            onNoteChange={setNote}
            onGroupChange={setCurrentGroup}
            readOnly={isDirect}
          />
        </div>

        <div className="w-full lg:w-80 lg:sticky lg:top-24">
          <CheckoutSidebar
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={total}
            hasShippingZones={shippingZones.length > 0}
            canSubmit={canSubmit}
            submitting={false}
            error={null}
            selectedPayment={paymentMethod}
            onConfirm={() => setShowPanel(true)}
          />
        </div>
      </div>

      {showPanel && paymentMethod && (
        <VoucherPanel
          payload={pedidoPayload}
          paymentMethod={paymentMethod}
          methods={paymentMethods}
          storeWhatsapp={storeWhatsapp}
          token={token}
          onClose={() => setShowPanel(false)}
          onSuccess={(orderId) => router.push(`/pedidos/${orderId}?nuevo=1`)}
        />
      )}
    </>
  )
}
