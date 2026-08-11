export interface OperatingHour {
  start: string
  end: string
}

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday"

export type OperatingHours = Partial<Record<DayOfWeek, OperatingHour>>

export interface LocationMetadata {
  parking: boolean
  wheelchairAccessible: boolean
  facilities: string[]
}

export interface CompanySummary {
  id: number
  name: string
  status: string
}

export interface LocationRequest {
  tenantId: number

  name: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string

  latitude: number
  longitude: number
  timezone: string

  frontdeskNumber: string
  mobileNumber: string
  tollFreeNumber: string

  email: string
  description: string

  operatingHours: OperatingHours

  isActive: boolean

  metadata: LocationMetadata
}

export interface GetLocationByIdResponseDto {
  id: number
  tenantId: number

  name: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string

  latitude: number
  longitude: number
  timezone: string

  frontdeskNumber: string
  mobileNumber: string
  tollFreeNumber: string

  email: string
  description: string

  operatingHours: OperatingHours

  isActive: boolean

  metadata: LocationMetadata

  createdAt: string
  updatedAt: string

  company: CompanySummary
}
