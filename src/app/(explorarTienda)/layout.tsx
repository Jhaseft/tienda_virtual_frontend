import BottomNav from "@/components/explorarTienda/home/BottomNav"

export default function ExplorarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BottomNav />
      {children}
    </>
  )
}
