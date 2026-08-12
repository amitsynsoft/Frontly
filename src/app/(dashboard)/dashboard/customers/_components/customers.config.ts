import type { CustomerDTO } from "@/types/dtos/customer.dto"

export const INITIAL_CUSTOMERS_DATA: CustomerDTO[] = [
  {
    id: "CUST-1001",
    name: "Robert Wilson",
    email: "rwilson@gmail.com",
    phone: "312-555-4827",
    status: "Active",
    totalBookings: 14,
    lastVisit: "2026-08-08",
    createdAt: "2024-01-15",
  },
]
