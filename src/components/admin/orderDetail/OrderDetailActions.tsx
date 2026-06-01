interface Props {
  actionLabel?: string;
  canCancel: boolean;
  isSaving: boolean;
  onAdvance: () => void;
  onCancel: () => void;
}

export default function OrderDetailActions({
  actionLabel, canCancel, isSaving, onAdvance, onCancel,
}: Props) {
  if (!actionLabel && !canCancel) return null;

  return (
    <div className="flex gap-3 pt-2">
      {canCancel && (
        <button
          type="button"
          disabled={isSaving}
          onClick={onCancel}
          className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          Cancelar pedido
        </button>
      )}
      {actionLabel && (
        <button
          type="button"
          disabled={isSaving}
          onClick={onAdvance}
          className="flex-1 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors disabled:opacity-60"
        >
          {isSaving ? "Guardando..." : actionLabel}
        </button>
      )}
    </div>
  );
}
