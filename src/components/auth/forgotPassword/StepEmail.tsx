interface Props {
  email: string
  isPending: boolean
  onEmailChange: (email: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function StepEmail({ email, isPending, onEmailChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <MailIcon />
        </span>
        <input
          type="email"
          placeholder="Correo electrónico"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-50 transition-colors"
      >
        {isPending ? "Enviando..." : "Enviar código"}
      </button>
    </form>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
