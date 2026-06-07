interface Props {
  newPassword: string
  confirmPassword: string
  isPending: boolean
  onNewPasswordChange: (val: string) => void
  onConfirmPasswordChange: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function StepPassword({
  newPassword,
  confirmPassword,
  isPending,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <LockIcon />
        </span>
        <input
          type="password"
          placeholder="Nueva contraseña"
          required
          value={newPassword}
          onChange={(e) => onNewPasswordChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
        />
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <LockIcon />
        </span>
        <input
          type="password"
          placeholder="Confirmar contraseña"
          required
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-50 transition-colors"
      >
        {isPending ? "Guardando..." : "Cambiar contraseña"}
      </button>
    </form>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
