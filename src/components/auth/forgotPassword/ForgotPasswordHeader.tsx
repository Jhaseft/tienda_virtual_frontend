type Step = "email" | "otp" | "password"

interface Props {
  step: Step
  email: string
}

export default function ForgotPasswordHeader({ step, email }: Props) {
  return (
    <div className="text-center mb-6">
      <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
        {step === "email" && <MailIcon />}
        {step === "otp" && <ShieldIcon />}
        {step === "password" && <LockIcon />}
      </div>

      <h1 className="text-2xl font-bold text-gray-900 leading-snug">
        {step === "email" && "Recuperar contraseña"}
        {step === "otp" && "Verifica tu código"}
        {step === "password" && "Nueva contraseña"}
      </h1>

      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
        {step === "email" && "Ingresa tu correo y te enviaremos un código de recuperación."}
        {step === "otp" && (
          <>
            Ingresa el código enviado a<br />
            <span className="font-medium text-gray-700">{email}</span>
          </>
        )}
        {step === "password" && "Elige una nueva contraseña segura para tu cuenta."}
      </p>
    </div>
  )
}

function MailIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="#7C3AED" strokeWidth="1.5" />
      <path d="M3 7l9 6 9-6" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l8 3.5v5C20 16 16.5 20.5 12 22 7.5 20.5 4 16 4 11.5v-5L12 3z" stroke="#7C3AED" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="#7C3AED" strokeWidth="1.5" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="#7C3AED" />
    </svg>
  )
}
