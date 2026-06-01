// Componentes UI reutilizables internos del panel de settings

export function Divider() {
  return <div className="border-t border-gray-100" />;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
      {children}
    </p>
  );
}

export function EditButton({ onClick, label = "Editar" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick}
      className="shrink-0 text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors">
      {label}
    </button>
  );
}

export function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

export function SettingsRow({
  label, value, editLabel = "Editar", onEdit,
}: {
  label: string; value: string; editLabel?: string; onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium leading-snug text-gray-900">{value}</p>
      </div>
      <EditButton onClick={onEdit} label={editLabel} />
    </div>
  );
}

export function SaveCancelRow({ onSave, onCancel, isSaving }: {
  onSave: () => void; onCancel: () => void; isSaving: boolean;
}) {
  return (
    <div className="flex gap-2 pt-1">
      <button type="button" onClick={onSave} disabled={isSaving}
        className="flex-1 rounded-xl bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition-colors">
        {isSaving ? "Guardando..." : "Guardar"}
      </button>
      <button type="button" onClick={onCancel}
        className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
        Cancelar
      </button>
    </div>
  );
}

export function InlineEdit({
  label, value, onChange, onSave, onCancel, isSaving, multiline = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  onSave: () => void; onCancel: () => void; isSaving: boolean; multiline?: boolean;
}) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3 mt-1">
      <label className="block text-xs font-medium text-gray-500">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
      )}
      <SaveCancelRow onSave={onSave} onCancel={onCancel} isSaving={isSaving} />
    </div>
  );
}

export function InlineField({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
    </div>
  );
}
