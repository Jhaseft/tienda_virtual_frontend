import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react"
import { SectionTitle } from "./SectionTitle"

type SectionMode = "normal" | "adding" | "editing" | "deleting"

interface SectionHeaderProps {
  title: string
  mode: SectionMode
  hasItems: boolean
  confirmingDelete?: boolean
  selectedCount?: number
  onAdd: () => void
  onEdit: () => void
  onDelete: () => void
  onCancel: () => void
  onConfirmDelete: () => void
}

export function SectionHeader({
  title, mode, hasItems, confirmingDelete = false, selectedCount = 0,
  onAdd, onEdit, onDelete, onCancel, onConfirmDelete,
}: SectionHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-2">
        <SectionTitle>{title}</SectionTitle>

        {mode === "normal" && (
          <div className="flex items-center gap-1.5 shrink-0">
            {hasItems && (
              <>
                <button
                  onClick={onEdit}
                  className="h-8 w-8 sm:w-auto sm:px-3 flex items-center justify-center sm:gap-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-violet-600 hover:bg-violet-50 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Editar</span>
                </button>
                <button
                  onClick={onDelete}
                  className="h-8 w-8 sm:w-auto sm:px-3 flex items-center justify-center sm:gap-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Eliminar</span>
                </button>
              </>
            )}
            <button
              onClick={onAdd}
              className="h-8 w-8 sm:w-auto sm:px-3 flex items-center justify-center sm:gap-1.5 rounded-xl text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 transition-all"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Agregar</span>
            </button>
          </div>
        )}

        {(mode === "editing" || mode === "deleting") && (
          <button
            onClick={onCancel}
            className="h-8 px-3 flex items-center gap-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cancelar</span>
          </button>
        )}
      </div>

      {mode === "deleting" && (
        <div className={`mb-3 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2 transition-all ${
          selectedCount > 0 ? "bg-red-50 border border-red-100" : "bg-gray-50 border border-gray-100"
        }`}>
          <p className={`font-medium text-xs ${selectedCount > 0 ? "text-red-600" : "text-gray-400"}`}>
            {selectedCount === 0
              ? "Toca los elementos a eliminar"
              : `${selectedCount} seleccionado${selectedCount > 1 ? "s" : ""}`}
          </p>
          {selectedCount > 0 && (
            <button
              onClick={onConfirmDelete}
              disabled={confirmingDelete}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg disabled:opacity-50 transition-all shrink-0"
            >
              {confirmingDelete
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Trash2 className="w-3.5 h-3.5" />}
              Eliminar
            </button>
          )}
        </div>
      )}

      {mode === "editing" && (
        <div className="mb-3 rounded-xl px-4 py-2.5 bg-gray-50 border border-violet-100">
          <p className="text-xs font-medium text-gray-500">Toca el elemento que quieres editar</p>
        </div>
      )}
    </>
  )
}
