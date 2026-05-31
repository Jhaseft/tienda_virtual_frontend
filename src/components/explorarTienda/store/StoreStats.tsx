"use client"

import { useState } from "react"
import StoreActions from "./StoreActions"

interface Props {
  storeId: string
  whatsapp: string | null
  rating: number
  totalReviews: number
  totalSales: number
  initialFollowers: number
  totalProducts: number
}

export default function StoreStats({
  storeId, whatsapp, rating, totalReviews,
  totalSales, initialFollowers, totalProducts,
}: Props) {
  const [followers, setFollowers] = useState(initialFollowers)

  function handleFollowChange(following: boolean) {
    setFollowers(prev => following ? prev + 1 : prev - 1)
  }

  return (
    <div className="flex flex-col gap-5 mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<StarIcon />}    value={rating.toFixed(1)}   sub={`${totalReviews} reseñas`} accent="text-amber-500"  bg="bg-amber-50" />
        <StatCard icon={<BagIcon />}     value={`+${totalSales}`}    sub="ventas"                    accent="text-violet-600" bg="bg-violet-50" />
        <StatCard icon={<HeartIcon />}   value={String(followers)}   sub="seguidores"                accent="text-pink-500"   bg="bg-pink-50" />
        <StatCard icon={<BoxIcon />}     value={String(totalProducts)} sub="productos"               accent="text-blue-500"   bg="bg-blue-50" />
      </div>

      <StoreActions storeId={storeId} whatsapp={whatsapp} onFollowChange={handleFollowChange} />
    </div>
  )
}

function StatCard({ icon, value, sub, accent, bg }: {
  icon: React.ReactNode; value: string; sub: string; accent: string; bg: string
}) {
  return (
    <div className={`flex items-center gap-3 ${bg} rounded-2xl px-4 py-3`}>
      <div className={`${accent} shrink-0`}>{icon}</div>
      <div>
        <p className={`text-base font-bold ${accent}`}>{value}</p>
        <p className="text-[10px] text-gray-400 leading-tight">{sub}</p>
      </div>
    </div>
  )
}

function StarIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
}
function BagIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V6a4 4 0 0 1 8 0v1" strokeLinecap="round" /></svg>
}
function HeartIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21C12 21 3 14.5 3 8.5a4.5 4.5 0 0 1 9-.5 4.5 4.5 0 0 1 9 .5C21 14.5 12 21 12 21z" /></svg>
}
function BoxIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeLinecap="round" /></svg>
}
