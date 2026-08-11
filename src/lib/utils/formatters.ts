import dayjs from "dayjs"

const CURRENCY_LOCALES: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "en-IE",
  GBP: "en-GB",
  CAD: "en-CA",
  AUD: "en-AU",
}

export function resolveCurrencyCode(
  currencyInput?: any,
  currencies?: any[]
): string {
  if (!currencyInput && currencyInput !== 0) return "INR"

  // If object with code, name, or symbol
  if (typeof currencyInput === "object" && currencyInput !== null) {
    return (
      currencyInput.code ||
      currencyInput.name ||
      currencyInput.symbol ||
      "INR"
    )
  }

  const str = String(currencyInput).trim()

  // Try matching by ID in currencies array
  if (currencies && Array.isArray(currencies) && currencies.length > 0) {
    const found = currencies.find((c: any) => String(c?.id) === str)
    if (found) {
      return found.code || found.name || found.symbol || "INR"
    }
  }

  // If non-numeric (e.g. "USD", "INR", "$"), return as is
  if (isNaN(Number(str))) {
    return str
  }

  return "INR"
}

export function formatCurrency(
  value: number,
  currencyInput?: any,
  currencies?: any[],
  locale?: string
) {
  const curr = resolveCurrencyCode(currencyInput, currencies)
  const loc =
    locale ||
    CURRENCY_LOCALES[curr.toUpperCase()] ||
    (curr.toUpperCase() === "INR" ? "en-IN" : "en-US")
  try {
    return new Intl.NumberFormat(loc, {
      currency: curr,
      maximumFractionDigits: 0,
      style: "currency",
    }).format(value)
  } catch {
    const rawSymbol =
      typeof currencyInput === "object" && currencyInput?.symbol
        ? currencyInput.symbol
        : curr
    return `${rawSymbol} ${value.toLocaleString()}`
  }
}

export function formatCompactCurrency(
  value: number,
  currencyInput?: any,
  currencies?: any[],
  locale?: string
) {
  const curr = resolveCurrencyCode(currencyInput, currencies)
  const loc =
    locale ||
    CURRENCY_LOCALES[curr.toUpperCase()] ||
    (curr.toUpperCase() === "INR" ? "en-IN" : "en-US")
  try {
    return new Intl.NumberFormat(loc, {
      style: "currency",
      currency: curr,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  } catch {
    return `${curr} ${value}`
  }
}

export function formatDate(value: string) {
  return dayjs(value).format("DD MMM YYYY")
}

export function formatDateTime(value: string) {
  return dayjs(value).format("DD MMM, h:mm A")
}

export function formatTime(value: string) {
  if (!value) return "—"
  if (!value.includes(":")) return value
  try {
    if (value.includes("T") || value.includes("-")) {
      return dayjs(value).format("h:mm A")
    }
    return dayjs(`2000-01-01T${value}`).format("h:mm A")
  } catch {
    return value
  }
}

/**
 * Safely parses a "YYYY-MM-DD" date string (or Date object) into a local timezone Date object.
 * This avoids the classic issue where new Date("YYYY-MM-DD") parses as UTC, leading to
 * the selected date showing up as one day before in negative timezone offsets.
 */
export function parseLocalDate(dateVal: string | Date | null | undefined): Date | undefined {
  if (!dateVal) return undefined
  if (dateVal instanceof Date) return dateVal

  // Extract the date-only portion to prevent timezone offset shifts
  const dateStr = typeof dateVal === "string" ? dateVal.split("T")[0] : dateVal

  const parsed = dayjs(dateStr)
  return parsed.isValid() ? parsed.toDate() : undefined
}
