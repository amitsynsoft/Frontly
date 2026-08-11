import { z } from "zod"
import { profileFormSchema } from "./profile-form.schema"

export type ProfileFormValues = z.infer<typeof profileFormSchema>
