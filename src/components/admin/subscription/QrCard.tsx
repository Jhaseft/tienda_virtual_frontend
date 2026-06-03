import Image from "next/image"

interface Props {
  qrImage: string | null
  amount: number
  dueDate: string
  onCancel: () => void
}

export default function QrCard({ qrImage, amount, dueDate, onCancel }: Props) {
  return (
    <div className="w-full bg-white rounded-3xl shadow-xl shadow-gray-200 border border-gray-100 overflow-hidden">

      {/* Header */}
      <div className="bg-linear-to-r from-violet-600 to-violet-500 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-violet-200">Monto a pagar</p>
          <p className="text-3xl font-black text-white leading-none mt-0.5">Bs {amount}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-violet-200 font-medium">Válido hasta</p>
          <p className="text-sm text-white font-bold">{dueDate}</p>
        </div>
      </div>

      {/* QR */}
      <div className="flex flex-col items-center py-6 px-6">
        {qrImage ? (
          <div className="p-3 bg-white rounded-2xl shadow-md border border-gray-100">
            <Image
              src={`data:image/png;base64,${qrImage}`}
              alt="QR de pago"
              width={300}
              height={300}
              unoptimized
              className="rounded-xl"
            />
          </div>
        ) : (
          <div className="w-72 h-72 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center">
            <p className="text-xs text-gray-400">QR no disponible</p>
          </div>
        )}

        <div className="flex items-center gap-2 mt-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <p className="text-xs text-amber-700 font-medium">Esperando confirmación de pago...</p>
        </div>
      </div>

      <div className="pb-5 flex justify-center">
        <button
          onClick={onCancel}
          className="text-sm text-gray-400 hover:text-gray-600 transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
