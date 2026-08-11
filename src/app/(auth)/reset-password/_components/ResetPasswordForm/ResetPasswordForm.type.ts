import { z } from "zod"

import { resetPasswordSchema, verifyOtpSchema } from "./ResetPasswordForm.schema"

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>

