interface Props {
  createdAt: string
}

export default function DateSection({ createdAt }: Props) {
  const dateTime = new Date(createdAt).toLocaleString('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  return (
    <div className="px-6 py-4 border-t border-gray-100">
      <p className="text-[16px] font-bold text-gray-800 mb-0.5">Fecha y hora de la creacion del pedido</p>
      <p className="text-sm text-gray-600">{dateTime}</p>
    </div>
  )
}
