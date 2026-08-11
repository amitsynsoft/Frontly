import { Currency } from "./currency.dto"

export interface TenantRequest {
  name: string
  currencyId: number
  logo: string
  description: string
  languagesSupported: string[]
  website: string
  status: "Active" | "InActive"
}

export interface GetTenantByIdResponseDto {
  id: number
  name: string
  logo: string
  description: string
  currencyId: number
  languagesSupported: string[]
  website: string
  status: "Active" | "InActive"
  createdAt: string
  updatedAt: string
  currency: {
    id: number
    name: string
    symbol: string
  }
}

export interface GetAllTenents {
  id: number
  name: string
  logo: string
  description: string
  currencyId: number
  languagesSupported: string[]
  website: string
  status: "Active" | "InActive"
  createdAt: string
  updatedAt: string
  currency: Currency
}
