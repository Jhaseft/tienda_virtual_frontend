export type TransportType = 'BUS' | 'AVION' | 'MOTO' | 'A_PIE' | 'PROPIO'

export interface ShippingZone {
  id: string
  city: string
  transportType: TransportType
  shippingCost: number
  minHours: number
  maxHours: number
  isActive: boolean
}

export interface CreateShippingZonePayload {
  city: string
  transportType: TransportType
  shippingCost: number
  minHours: number
  maxHours: number
}

export interface UpdateShippingZonePayload {
  city?: string
  transportType?: TransportType
  shippingCost?: number
  minHours?: number
  maxHours?: number
  isActive?: boolean
}

export const TRANSPORT_CONFIG: Record<TransportType, { label: string }> = {
  BUS:    { label: 'Bus' },
  AVION:  { label: 'Avión' },
  MOTO:   { label: 'Moto' },
  A_PIE:  { label: 'A pie' },
  PROPIO: { label: 'Vehículo propio' },
}

export const TRANSPORT_OPTIONS: TransportType[] = ['BUS', 'AVION', 'MOTO', 'A_PIE', 'PROPIO']
