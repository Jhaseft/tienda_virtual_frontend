import type { CreateShippingZonePayload } from "@/types/shippingZone"

export const EMPTY_FORM: CreateShippingZonePayload = {
  city: '',
  transportType: 'BUS',
  shippingCost: 0,
  minHours: 1,
  maxHours: 24,
}

function horasATexto(h: number): string {
  if (h === 0) return '0 horas'
  const dias = Math.floor(h / 24)
  const horas = h % 24
  const partes: string[] = []
  if (dias > 0) partes.push(`${dias} ${dias === 1 ? 'día' : 'días'}`)
  if (horas > 0) partes.push(`${horas} ${horas === 1 ? 'hora' : 'horas'}`)
  return partes.join(' y ')
}

export function formatTime(min: number, max: number): string {
  return `Mín. ${horasATexto(min)} · Máx. ${horasATexto(max)}`
}
