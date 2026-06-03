const STEPS = [
  { n: "1", text: "Abre tu app bancaria" },
  { n: "2", text: 'Selecciona "Pagar con QR"' },
  { n: "3", text: "Escanea el código" },
]

export default function QrSteps() {
  return (
    <div className="w-full grid grid-cols-3 gap-2">
      {STEPS.map(({ n, text }) => (
        <div key={n} className="flex flex-col items-center gap-1.5 bg-violet-50 rounded-2xl py-3 px-2 text-center">
          <span className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs font-black flex items-center justify-center">
            {n}
          </span>
          <p className="text-[11px] text-violet-700 font-medium leading-tight">{text}</p>
        </div>
      ))}
    </div>
  )
}
