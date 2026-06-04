interface Props {
  ownerName: string | null
  storeName: string | null
}

export default function DashboardHeader({ ownerName, storeName }: Props) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches"

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {greeting}, {ownerName ?? "Vendedor"} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {storeName ? `Tienda: ${storeName}` : "Bienvenido a tu panel de control"}
        </p>
      </div>
    </div>
  )
}
