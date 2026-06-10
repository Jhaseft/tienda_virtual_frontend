import { EditButton } from "./EditButton"

export function SettingsRow({
  label, value, editLabel = "Editar", onEdit,
}: {
  label: string
  value: string
  editLabel?: string
  onEdit: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium leading-snug text-gray-900">{value}</p>
      </div>
      <EditButton onClick={onEdit} label={editLabel} />
    </div>
  )
}
