export type BranchResourceRequest = {
  tenantId: number
  branchId: number
  resourceTypeId: number
  name: string
  maxCapacity: number
}

export type BranchResourceResponse = {
  id: number
  tenantId: number
  branchId: number
  resourceTypeId: number
  name: string
  maxCapacity: number
  createdAt: string
  updatedAt: string

  branch: {
    id: number
    name: string
  }

  resourceType: {
    id: number
    name: string
  }
}
