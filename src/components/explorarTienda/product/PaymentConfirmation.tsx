"use client"

import type { PaymentMethod } from "@/types/explorar"
import { MessageCircle, ShoppingBag, Camera, Send } from "lucide-react"

interface Props {
    method: PaymentMethod
    whatsapp: string | null
    productName: string
    onClose: () => void
}

export default function PaymentConfirmation({ whatsapp, productName, onClose }: Props) {



    function handleWhatsApp() {
        if (!whatsapp) return
        const number = whatsapp.replace(/\D/g, "")
        const msg = `Hola! Acabo de realizar el pago del producto *${productName}*. Te adjunto el comprobante.`
        window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, "_blank")
    }

    return (
        <div className="flex flex-col">



            <div className="px-5 pt-4 pb-6 flex flex-col gap-4">

                <div className="flex flex-col items-center gap-1 py-2 text-center">
                    <div className="relative w-16 h-16 flex items-center justify-center mb-1">
                        <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping" />
                        <div className="absolute inset-1 rounded-full bg-emerald-100" />
                        <svg className="relative z-10" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <path d="M22 4L12 14.01l-3-3" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">¡Pago realizado!</h3>
                    <p className="text-sm text-gray-400">Ahora envía tu comprobante al vendedor</p>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3.5 flex flex-col gap-2">
                    <p className="text-xs font-bold text-black uppercase tracking-wide">Consejos</p>
                    <div className="flex items-start gap-2">
                        <Camera className="text-sky-400 shrink-0 mt-0.5" size={16} />
                        <span className="text-sm text-sky-700">Toma una captura clara donde se vea el monto y la fecha</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <Send className="text-sky-400 shrink-0 mt-0.5" size={16} />
                        <span className="text-sm text-sky-700">Envía por WhatsApp</span>
                    </div>
                </div>



                <div className="flex flex-col gap-2.5">
                    <button
                        onClick={handleWhatsApp}
                        disabled={!whatsapp}
                        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-40 text-white text-sm font-bold shadow-md shadow-emerald-200 transition-all active:scale-[0.98]"
                    >
                        <MessageCircle size={18} />
                        Enviar comprobante por WhatsApp
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-all active:scale-[0.98]"
                    >
                        <ShoppingBag size={17} />
                        Seguir comprando
                    </button>
                </div>

            </div>
        </div>
    )
}

