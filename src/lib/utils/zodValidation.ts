import { parsePhoneNumberFromString } from "libphonenumber-js"
import { z } from "zod"

export const phoneSchema = (message?: string, optional: boolean = false) => {
  // ✅ base string FIRST
  let schema = z.string().trim()

  // ✅ apply required condition BEFORE transform
  if (!optional) {
    schema = schema.nonempty("Phone number is required")
  }

  // ✅ now apply refine + transform
  const finalSchema = schema
    .refine(
      (val) => {
        if (!val) return optional // allow empty if optional

        const withPlus = val.startsWith("+") ? val : `+${val}`
        const phone = parsePhoneNumberFromString(withPlus)
        return phone?.isValid() ?? false
      },
      { message: message || "Invalid phone number" }
    )
    .transform((val) => {
      if (!val) return val
      return val.startsWith("+") ? val : `+${val}`
    })

  // ✅ optional wrapper at END
  return optional ? finalSchema.optional().or(z.literal("")) : finalSchema
}
// password complexity validator
export const passwordComplexity = (
  requiredMessage?: string,
  minLengthMessage?: string,
  maxLengthMessage?: string,
  complexityMessage?: string
) => {
  return z
    .string()
    .trim()
    .min(1, requiredMessage || "Password is required")
    .min(8, minLengthMessage || "Password must be at least 8 characters")
    .max(50, maxLengthMessage || "Password must be at most 50 characters")
    .refine(
      (val) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[\S]{8,}$/.test(val),
      {
        message:
          complexityMessage ||
          "Password must include upper, lower, number & special character",
      }
    )
}
// zip code validation
export const ZIP_CODE_RULES = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 20,
}

/**
 * Rules:
 * - 3–20 characters (excluding leading/trailing spaces)
 * - Alphanumeric + spaces + hyphen allowed inside
 * - Must contain at least ONE number
 * - Cannot be only letters
 */
export const ZIP_CODE_REGEX = /^(?=.*\d)[a-zA-Z0-9 -]+$/

export function isValidzipCode(value: string): boolean {
  const trimmed = value.trim()

  if (
    trimmed.length < ZIP_CODE_RULES.MIN_LENGTH ||
    trimmed.length > ZIP_CODE_RULES.MAX_LENGTH
  ) {
    return false
  }

  return ZIP_CODE_REGEX.test(trimmed)
}
