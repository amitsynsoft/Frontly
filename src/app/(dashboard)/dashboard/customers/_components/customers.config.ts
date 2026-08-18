import type { CustomerDTO } from "@/types/dtos/customer.dto"

export const INITIAL_CUSTOMERS_DATA: CustomerDTO[] = [
  {
    id: "CUST-1001",
    name: "David Miller",
    email: "dmiller@gmail.com",
    phone: "713-555-0198",
    status: "Active",
    totalBookings: 5,
    lastVisit: "2026-09-27",
    createdAt: "2024-03-18",
  },
]
