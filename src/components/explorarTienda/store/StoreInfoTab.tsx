import { StoreDetail } from "@/types/explorar"

interface Props {
  store: StoreDetail
}

export default function StoreInfoTab({ store }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {store.description && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-1.5">Sobre la tienda</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{store.description}</p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Información de contacto</h3>
        <div className="flex flex-col gap-3">
          {store.city && (
            <InfoRow icon={<PinIcon />} label="Ciudad" value={store.city} />
          )}
          {store.address && (
            <InfoRow icon={<AddressIcon />} label="Dirección" value={store.address} />
          )}
          {store.whatsapp && (
            <InfoRow icon={<PhoneIcon />} label="WhatsApp" value={store.whatsapp} />
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Estadísticas</h3>
        <div className="grid grid-cols-3 gap-3">
          <StatBox value={store.rating.toFixed(1)} label="Rating" accent="text-amber-500" />
          <StatBox value={String(store.totalReviews)} label="Reseñas" />
          <StatBox value={`+${store.totalSales}`} label="Ventas" />
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-700 font-medium">{value}</p>
      </div>
    </div>
  )
}

function StatBox({ value, label, accent = "text-gray-900" }: { value: string; label: string; accent?: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-3 text-center">
      <p className={`text-lg font-bold ${accent}`}>{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function AddressIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9l1-5h16l1 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 9v11h14V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
