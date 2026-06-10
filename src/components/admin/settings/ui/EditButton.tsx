export function EditButton({ onClick, label = "Editar" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors"
    >
      {label}
    </button>
  )
}
