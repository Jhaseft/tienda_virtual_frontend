type Step = "email" | "otp" | "password"

const STEPS: Step[] = ["email", "otp", "password"]

interface Props {
  current: Step
}

export default function StepIndicator({ current }: Props) {
  const currentIndex = STEPS.indexOf(current)

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {STEPS.map((s, i) => (
        <div
          key={s}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            current === s
              ? "bg-violet-600"
              : currentIndex > i
              ? "bg-violet-300"
              : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  )
}
