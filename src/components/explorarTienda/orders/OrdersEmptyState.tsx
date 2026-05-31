interface Props {
  activeTab: string
}

export default function OrdersEmptyState({ activeTab }: Props) {
  const isAll = activeTab === 'TODOS'

  return (
    <div className="flex flex-col items-center py-20 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
        <BagIcon />
      </div>
      <p className="text-gray-700 font-semibold text-base">
        {isAll ? 'No tienes pedidos aún' : 'Sin pedidos en esta categoría'}
      </p>
      <p className="text-gray-400 text-sm text-center max-w-xs">
        {isAll
          ? 'Cuando realices una compra en una tienda, aparecerá aquí.'
          : 'Prueba cambiando el filtro de estado para ver otros pedidos.'}
      </p>
    </div>
  )
}

function BagIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
        stroke="#7C3AED"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 6h18M16 10a4 4 0 0 1-8 0"
        stroke="#7C3AED"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
