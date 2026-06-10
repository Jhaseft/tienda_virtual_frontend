import { Bus, Plane, Bike, Footprints, Car, type LucideIcon } from 'lucide-react'

export const TRANSPORT_ICONS: Record<string, LucideIcon> = {
  AVION:  Plane,
  BUS:    Bus,
  MOTO:   Bike,
  A_PIE:  Footprints,
  PROPIO: Car,
}

export const TRANSPORT_LABELS: Record<string, string> = {
  AVION:  'Aéreo',
  BUS:    'Bus',
  MOTO:   'Moto',
  A_PIE:  'A pie',
  PROPIO: 'Vehículo propio',
}
