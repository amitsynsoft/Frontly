import { ResetPasswordFormValues, VerifyOtpFormValues } from "./ResetPasswordForm.type"

export const defaultValues: ResetPasswordFormValues = {
  email: "",
  newPassword: "",
  confirmNewPassword: "",
}

export const labels = {
  email: "Email address",
  newPassword: "New password",
  confirmNewPassword: "Confirm new password",
}

export const placeholders = {
  email: "Fetching email...",
  newPassword: "Enter new password",
  confirmNewPassword: "Confirm new Password",
}

export const otpDefaultValues: VerifyOtpFormValues = {
  otp: "",
}

export const otpLabels = {
  otp: "Verification Code",
}

export const otpPlaceholders = {
  otp: "Enter 6-digit OTP",
}

