import BottomNav from "@/app/layout/BottomNav"

export default function ExplorarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BottomNav />
      {children}
    </>
  )
}
