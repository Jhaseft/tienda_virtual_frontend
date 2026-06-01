import { Bell } from "lucide-react"

interface Props {
  ownerName: string | null
  storeName: string | null
}

export default function DashboardHeader({ ownerName, storeName }: Props) {
  return (
    <div className="relative bg-linear-to-br from-violet-600 to-violet-500 px-5 pt-6 pb-8 -mx-4 -mt-5 md:-mx-8 md:-mt-6 mb-2 overflow-hidden">

      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute top-4 right-16 w-16 h-16 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-6 w-36 h-36 rounded-full bg-white/10" />
      <div className="absolute bottom-2 left-24 w-10 h-10 rounded-full bg-white/10" />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-white/5" />

      <div className="relative flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            ¡Hola, {ownerName ?? "Vendedor"}! 👋
          </h1>
          <p className="text-sm text-violet-200 mt-0.5">{storeName ?? ""}</p>
        </div>
        <button className="relative w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors border border-white/20">
          <Bell size={18} className="text-white" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
