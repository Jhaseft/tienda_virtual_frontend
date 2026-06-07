import OtpInput from "@/components/ui/OtpInput"

interface Props {
  otp: string[]
  isPending: boolean
  resendCooldown: number
  onOtpChange: (otp: string[]) => void
  onVerify: () => void
  onResend: () => void
}

export default function StepOtp({ otp, isPending, resendCooldown, onOtpChange, onVerify, onResend }: Props) {
  return (
    <div className="space-y-5">
      <OtpInput value={otp} onChange={onOtpChange} />

      <button
        onClick={onVerify}
        disabled={otp.join("").length < 6 || isPending}
        className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-50 transition-colors"
      >
        {isPending ? "Verificando..." : "Verificar código"}
      </button>

      <div className="text-center">
        <button
          onClick={onResend}
          disabled={resendCooldown > 0}
          className="text-sm text-violet-600 hover:text-violet-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : "Reenviar código"}
        </button>
      </div>
    </div>
  )
}
