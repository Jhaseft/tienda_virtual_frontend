import type React from "react";
import { Bus, Plane, Bike, Footprints, Car, MessageCircle, Store, QrCode, Building2, Smartphone, Wallet, Banknote, type LucideIcon } from "lucide-react";
import type { AdminOrder } from "@/types/admin";
import { formatTime } from "@/components/explorarTienda/checkout/shipping/shippingUtils";

const TRANSPORT_ICONS: Record<string, LucideIcon> = {
  BUS: Bus, AVION: Plane, MOTO: Bike, A_PIE: Footprints, PROPIO: Car,
};

const TRANSPORT_LABEL: Record<string, string> = {
  BUS: "Bus", AVION: "Aéreo", MOTO: "Moto", A_PIE: "A pie", PROPIO: "Vehículo propio",
};

const PAYMENT_CONFIG: Record<string, { label: string; Icon: LucideIcon; color: string; bg: string }> = {
  QR:            { label: "QR Bancario",            Icon: QrCode,        color: "text-violet-600", bg: "bg-violet-100" },
  TRANSFERENCIA: { label: "Transferencia bancaria", Icon: Building2,     color: "text-blue-600",   bg: "bg-blue-100"   },
  YAPE:          { label: "Yape",                   Icon: Smartphone,    color: "text-purple-600", bg: "bg-purple-100" },
  TIGO_MONEY:    { label: "Tigo Money",             Icon: Wallet,        color: "text-yellow-600", bg: "bg-yellow-100" },
  EFECTIVO:      { label: "Efectivo al recibir",    Icon: Banknote,      color: "text-emerald-600",bg: "bg-emerald-100"},
  WHATSAPP:      { label: "Coordinar por WhatsApp", Icon: MessageCircle, color: "text-green-600",  bg: "bg-green-100"  },
};

interface Props {
  order: AdminOrder;
}

export default function OrderDetailInfo({ order }: Props) {
  const payment = PAYMENT_CONFIG[order.paymentMethod] ?? {
    label: order.paymentMethod,
    Icon: Banknote,
    color: "text-gray-600",
    bg: "bg-gray-100",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">

      {/* Método de pago */}
      <div className="px-5 py-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Método de pago</p>
        <InfoCard
          icon={<payment.Icon className={`w-5 h-5 ${payment.color}`} />}
          iconBg={payment.bg}
          label={payment.label}
        />
      </div>

      {/* Enviar a */}
      {order.address && (
        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Enviar a</p>
          <p className="text-sm font-semibold text-gray-900 mb-1">{order.address.fullName}</p>
          <div className="space-y-0.5">
            <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Calle</span> · {order.address.street}</p>
            <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Ciudad</span> · {order.address.city}</p>
            <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Dpto.</span> · {order.address.state}</p>
            <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Tel</span> · {order.address.phone}</p>
          </div>
        </div>
      )}

      {/* Método de envío */}
      <div className="px-5 py-4 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Método de envío</p>
        {order.shippingZone ? (
          <ZoneCard zone={order.shippingZone} />
        ) : (
          <PickupCard pickupMethod={order.pickupMethod} paymentMethod={order.paymentMethod} />
        )}
      </div>

    </div>
  );
}

function InfoCard({ icon, iconBg, label, sublabel, price }: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  sublabel?: string;
  price?: string;
}) {
  return (
    <div className="flex gap-3 px-4 py-3 rounded-2xl border border-violet-200 bg-violet-50">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          {price && (
            <p className={`text-sm font-bold shrink-0 ${price === "Gratis" ? "text-emerald-600" : "text-gray-900"}`}>
              {price}
            </p>
          )}
        </div>
        {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}

function ZoneCard({ zone }: { zone: NonNullable<AdminOrder["shippingZone"]> }) {
  const Icon = TRANSPORT_ICONS[zone.transportType] ?? Bus;
  const price = zone.shippingCost === 0 ? "Gratis" : `Bs. ${zone.shippingCost.toFixed(2)}`;
  const sublabel = `${TRANSPORT_LABEL[zone.transportType] ?? zone.transportType} · ${formatTime(zone.minHours, zone.maxHours)}`;
  return (
    <InfoCard
      icon={<Icon className="w-5 h-5 text-violet-600" />}
      iconBg="bg-violet-100"
      label={zone.city}
      sublabel={sublabel}
      price={price}
    />
  );
}

function PickupCard({ pickupMethod, paymentMethod }: { pickupMethod: AdminOrder["pickupMethod"]; paymentMethod: string }) {
  const isWhatsapp = pickupMethod === "WHATSAPP" || paymentMethod === "WHATSAPP";
  return (
    <InfoCard
      icon={isWhatsapp
        ? <MessageCircle className="w-5 h-5 text-violet-600" />
        : <Store className="w-5 h-5 text-violet-600" />
      }
      iconBg="bg-violet-100"
      label={isWhatsapp ? "Coordinación por WhatsApp" : "Recojo en tienda"}
      sublabel={isWhatsapp ? "El vendedor acordará la entrega con el cliente" : "Coordinar con el cliente"}
      price="Gratis"
    />
  );
}
