export function SaveCancelRow({
  onSave, onCancel, isSaving,
}: {
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
}) {
  return (
    <div className="flex gap-2 pt-1">
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="flex-1 rounded-xl bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition-colors"
      >
        {isSaving ? "Guardando..." : "Guardar"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
      >
        Cancelar
      </button>
    </div>
  )
}
