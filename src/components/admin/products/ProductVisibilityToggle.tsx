interface Props {
  value: boolean
  onChange: (value: boolean) => void
}

export default function ProductVisibilityToggle({ value, onChange }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">Mostrar en mi tienda</p>
          <p className="text-xs text-gray-400 mt-0.5">Los clientes podrán ver este producto</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            value ? "bg-violet-600" : "bg-gray-200"
          }`}
          aria-label="Visibilidad del producto"
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
              value ? "left-6" : "left-0.5"
            }`}
          />
        </button>
      </div>
    </section>
  )
}
