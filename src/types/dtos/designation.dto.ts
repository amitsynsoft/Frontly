export type DesignationRequest = {
  name: string
  description?: string
}

export type DesignationResponse = {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}
