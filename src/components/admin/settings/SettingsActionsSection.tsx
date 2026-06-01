import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Store } from "lucide-react";
import { SectionTitle } from "./SettingsUI";

interface Props {
  notificationsEnabled: boolean;
  onToggleNotifications: (v: boolean) => void;
}

export default function SettingsActionsSection({ notificationsEnabled, onToggleNotifications }: Props) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-1">
      <SectionTitle>Acciones</SectionTitle>

      {/* Notificaciones */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <Bell size={15} className="text-blue-500" strokeWidth={2} />
          </div>
          <p className="text-sm font-medium text-gray-800">Notificaciones</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={notificationsEnabled}
          onClick={() => onToggleNotifications(!notificationsEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notificationsEnabled ? "bg-emerald-500" : "bg-gray-200"
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            notificationsEnabled ? "translate-x-6" : "translate-x-1"
          }`} />
        </button>
      </div>

      <div className="border-t border-gray-100" />

      {/* Ir como cliente */}
      <button
        type="button"
        onClick={() => router.push("/")}
        className="w-full flex items-center gap-3 py-2.5 text-left group"
      >
        <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
          <Store size={15} className="text-violet-500" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800">Ir a la tienda</p>
          <p className="text-xs text-gray-400">Explora como comprador</p>
        </div>
        <span className="text-xs text-violet-500 font-medium group-hover:underline">Abrir</span>
      </button>

      <div className="border-t border-gray-100" />

      {/* Cerrar sesión */}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/signin" })}
        className="w-full flex items-center gap-3 py-2.5 text-left group"
      >
        <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
          <LogOut size={15} className="text-rose-500" strokeWidth={2} />
        </div>
        <p className="text-sm font-medium text-rose-600">Cerrar sesión</p>
      </button>
    </div>
  );
}
