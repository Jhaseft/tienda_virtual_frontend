import Image from 'next/image'
import type { OrderDetail } from '@/types/orders'

interface Props {
  order: OrderDetail
}

export default function OrderDetailLeft({ order }: Props) {
  const whatsappNumber = order.store.whatsapp?.replace(/\D/g, '')

  return (
    <div className="flex flex-col gap-4">
      {/* Tarjeta de tienda */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-violet-50 shrink-0">
            {order.store.logoUrl ? (
              <Image
                src={order.store.logoUrl}
                alt={order.store.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <StoreIcon />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900">{order.store.name}</p>
            {order.store.storeType && (
              <p className="text-sm text-gray-400 mt-0.5">{order.store.storeType}</p>
            )}
          </div>
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
            >
              <WhatsAppIcon />
              <span className="hidden sm:inline">Contactar</span>
            </a>
          )}
        </div>

        {order.whatsappThreadUrl && (
          <a
            href={order.whatsappThreadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 text-sm text-violet-600 font-medium hover:underline"
          >
            <ChatIcon />
            Ver conversación
          </a>
        )}
      </div>

      {/* Lista de productos */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-4">
          Productos ({order.items.length})
        </h2>
        <div className="flex flex-col divide-y divide-gray-50">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {item.product.photos[0] ? (
                  <Image
                    src={item.product.photos[0].url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImagePlaceholder />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {item.product.name}
                </p>
                <div className="flex gap-3 flex-wrap mt-0.5">
                  {item.size && (
                    <span className="text-xs text-gray-400">
                      Talla:{' '}
                      <span className="font-medium text-gray-600">{item.size}</span>
                    </span>
                  )}
                  {item.colorName && (
                    <span className="text-xs text-gray-400">
                      Color:{' '}
                      <span className="font-medium text-gray-600">{item.colorName}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Bs {item.unitPrice.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-gray-800 shrink-0">
                Bs {(item.unitPrice * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dirección de entrega */}
      {order.deliveryAddress && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Dirección de entrega
          </p>
          <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
        </div>
      )}

      {/* Notas */}
      {order.notes && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Notas
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">{order.notes}</p>
        </div>
      )}
    </div>
  )
}

function StoreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        stroke="#7C3AED"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22V12h6v10"
        stroke="#7C3AED"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.001 22l4.948-1.42A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 0 1-4.076-1.117l-.292-.174-3.035.871.842-3.094-.19-.303A7.96 7.96 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ImagePlaceholder() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#D1D5DB" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB" />
      <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
