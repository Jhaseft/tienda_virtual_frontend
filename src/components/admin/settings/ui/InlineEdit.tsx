import { SaveCancelRow } from "./SaveCancelRow"

export function InlineEdit({
  label, value, onChange, onSave, onCancel, isSaving, multiline = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
  multiline?: boolean
}) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3 mt-1">
      <label className="block text-xs font-medium text-gray-500">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
        />
      )}
      <SaveCancelRow onSave={onSave} onCancel={onCancel} isSaving={isSaving} />
    </div>
  )
}
