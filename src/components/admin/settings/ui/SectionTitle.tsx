export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 whitespace-nowrap">
      {children}
    </p>
  )
}
