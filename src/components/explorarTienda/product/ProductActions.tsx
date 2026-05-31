"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { checkIsFavorite, addFavorite, removeFavorite, fetchStorePaymentMethods } from "@/app/(explorarTienda)/api/public-explorarTienda.api"
import type { PaymentMethod } from "@/types/explorar"
import PaymentModal from "./PaymentModal"

interface Props {
  productId: string
  productName: string
  price: number
  whatsapp: string | null
  storeName: string
  storeId: string
  selectedSize?: string | null
  selectedColor?: string | null
}

export default function ProductActions({
  productId, productName, price, whatsapp, storeName, storeId, selectedSize, selectedColor,
}: Props) {
  const { data: session } = useSession()
  const [favorite, setFavorite] = useState(false)
  const [loadingFav, setLoadingFav] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [showPayModal, setShowPayModal] = useState(false)
  const [loadingPay, setLoadingPay] = useState(false)

  useEffect(() => {
    if (!session?.user?.backendToken) return
    checkIsFavorite(productId, session.user.backendToken).then(setFavorite)
  }, [productId, session?.user?.backendToken])

  async function handleFavorite() {
    if (!session?.user?.backendToken) return
    setLoadingFav(true)
    try {
      if (favorite) {
        await removeFavorite(productId, session.user.backendToken)
        setFavorite(false)
      } else {
        await addFavorite(productId, session.user.backendToken)
        setFavorite(true)
      }
    } finally {
      setLoadingFav(false)
    }
  }

  async function handlePay() {
    setLoadingPay(true)
    const methods = await fetchStorePaymentMethods(storeId)
    setPaymentMethods(methods)
    setLoadingPay(false)
    setShowPayModal(true)
  }

  function handleWhatsApp() {
    if (!whatsapp) return
    const number = whatsapp.replace(/\D/g, "")
    const extras = [
      selectedSize ? `Talla: ${selectedSize}` : null,
      selectedColor ? `Color: ${selectedColor}` : null,
    ].filter(Boolean).join(", ")
    const msg = `Hola! Me interesa el producto *${productName}* de ${storeName} — Bs ${price.toFixed(2)}${extras ? ` (${extras})` : ""}. ¿Está disponible?`
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  return (
    <div className="flex flex-col gap-3">

      <button
        onClick={handleWhatsApp}
        disabled={!whatsapp}
        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-sm font-semibold py-4 rounded-2xl transition-colors shadow-sm shadow-violet-200"
      >
        <WhatsAppIcon />
        Consultar por WhatsApp
      </button>

      {showPayModal && (
        <PaymentModal
          methods={paymentMethods}
          whatsapp={whatsapp}
          productName={productName}
          onClose={() => setShowPayModal(false)}
        />
      )}

      <button
        onClick={handlePay}
        disabled={loadingPay}
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-semibold py-4 rounded-2xl transition-colors shadow-sm shadow-emerald-200"
      >
        <CreditCardIcon />
        {loadingPay ? "Cargando..." : "Pagar"}
      </button>

      <button
        onClick={handleFavorite}
        disabled={loadingFav || !session}
        className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-3.5 rounded-2xl border-2 transition-all disabled:opacity-40 ${
          favorite
            ? "border-pink-400 bg-pink-50 text-pink-600"
            : "border-gray-200 bg-white text-gray-600 hover:border-pink-300 hover:text-pink-500"
        }`}
      >
        <HeartIcon filled={favorite} />
        {favorite ? "En favoritos" : "Agregar a favoritos"}
      </button>
    </div>
  )
}

function CreditCardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.564 4.14 1.541 5.874L.057 23.428a.5.5 0 0 0 .606.614l5.701-1.493A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 0 1-5.015-1.377l-.36-.214-3.733.977.999-3.635-.235-.374A9.778 9.778 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21C12 21 3 14.5 3 8.5a4.5 4.5 0 0 1 9-.5 4.5 4.5 0 0 1 9 .5C21 14.5 12 21 12 21z" />
    </svg>
  )
}
