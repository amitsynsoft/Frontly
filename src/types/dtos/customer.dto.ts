export type CustomerStatus = "Active" | "Inactive"

export interface CustomerDTO {
  id: string
  name: string
  email: string
  phone: string
  status: CustomerStatus
  totalBookings?: number
  lastVisit?: string
  avatarUrl?: string
  createdAt?: string
}

export interface CustomerFilters {
  status: string
  search: string
}
