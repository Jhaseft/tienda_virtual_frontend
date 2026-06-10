'use client'

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, Download, Maximize2 } from "lucide-react";
import type { AdminOrder } from "@/types/admin";

interface Props {
  order: AdminOrder;
}

function VoucherLightbox({ url, onClose }: { url: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col"
      onClick={handleBackdrop}
    >
      <div className="flex items-center justify-between px-5 py-3 bg-black/40 shrink-0">
        <p className="text-sm font-medium text-white/80">Comprobante de pago</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            disabled={zoom <= 0.5}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/60 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            disabled={zoom >= 3}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <a
            href={url}
            download
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="Comprobante de pago"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center", transition: "transform 0.2s" }}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <p className="text-center text-xs text-white/30 pb-3 shrink-0">
        Clic fuera de la imagen para cerrar · Scroll para ver completo
      </p>
    </div>
  );
}

export default function OrderDetailProducts({ order }: Props) {
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Productos</p>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-violet-50">
                {item.photoUrl ? (
                  <Image src={item.photoUrl} alt={item.productName} fill className="object-cover" sizes="48px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[11px] font-bold text-violet-500">
                    {item.productName.slice(0, 3).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.productName}</p>
                <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                  {item.size && <span>Variante: {item.size}</span>}
                  {item.colorName && <span>Color: {item.colorName}</span>}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-gray-900">Bs {item.unitPrice.toFixed(2)}</p>
                <p className="text-xs text-gray-400">x{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {order.voucherUrl && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Comprobante de pago</p>
              <button
                onClick={() => setLightbox(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Ver completo
              </button>
            </div>
            <button
              onClick={() => setLightbox(true)}
              className="w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-50 hover:border-blue-200 transition group relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={order.voucherUrl}
                alt="Comprobante de pago"
                className="w-full max-h-52 object-contain bg-white"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition bg-black/60 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs text-white font-medium">Ampliar</span>
                </div>
              </div>
            </button>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-gray-100 space-y-1.5">
          {order.subtotal > 0 && order.subtotal !== order.total && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-700">Bs {order.subtotal.toFixed(2)}</span>
            </div>
          )}
          {order.shippingCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Costo de envío</span>
              <span className="text-gray-700">Bs {order.shippingCost.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm font-semibold text-gray-700">Costo total</span>
            <span className="text-base font-bold text-gray-900">Bs {order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {lightbox && order.voucherUrl && (
        <VoucherLightbox url={order.voucherUrl} onClose={() => setLightbox(false)} />
      )}
    </>
  );
}
