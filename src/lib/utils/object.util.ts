export const jsonToFormData = (jsonObject: Record<string, any>): FormData => {
  const formData = new FormData()

  const appendFormData = (data: any, parentKey?: string) => {
    if (data && typeof data === "object" && !(data instanceof File)) {
      if (data instanceof Date) {
        formData.append(parentKey!, data.toISOString())
      } else {
        Object.keys(data).forEach((key) => {
          appendFormData(data[key], parentKey ? `${parentKey}[${key}]` : key)
        })
      }
    } else {
      if (data instanceof File) {
        formData.append(parentKey!, data)
      } else {
        const value = data == null ? "" : data
        formData.append(parentKey!, value)
      }
    }
  }

  appendFormData(jsonObject)
  return formData
}

export const addSerialNumber = (
  data: Record<string, any>[] = [],
  page: number,
  pageSize: number,
  addId?: boolean
): any[] => {
  if (!data) return []
  return data.map((item, index) => {
    const serialNumber = index + 1 + pageSize * (page - 1)
    const updatedItem: Record<string, any> = { ...item, serialNumber }

    if (addId) updatedItem.id = serialNumber
    return updatedItem
  })
}

type Key = string | number | symbol

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce(
    (result, currentValue) => {
      const groupKey = currentValue[key] as string
      ;(result[groupKey] = result[groupKey] || []).push(currentValue)
      return result
    },
    {} as Record<Key, T[]>
  )
}

export const isObject = (variable: unknown): boolean => {
  return (
    variable !== null &&
    typeof variable === "object" &&
    !Array.isArray(variable)
  )
}
