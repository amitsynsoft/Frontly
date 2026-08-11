// utils/date.ts
import { format } from "date-fns"

type FormatDateTimeOptions = {
  withTime?: boolean
}

export const formatDateTime = (
  date?: string | Date,
  options: FormatDateTimeOptions = {}
) => {
  if (!date) return "-"

  const { withTime = true } = options // ✅ default = true

  try {
    const formatString = withTime ? "dd/MM/yyyy hh:mm a" : "dd/MM/yyyy"

    return format(new Date(date), formatString)
  } catch {
    return "-"
  }
}
