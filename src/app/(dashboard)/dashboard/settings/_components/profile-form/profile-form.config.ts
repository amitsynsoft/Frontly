import type { ProfileFormValues } from "./profile-form.type"
import type { UserDTO } from "@/types/dtos/user.dto"

export function getProfileDefaultValues(user?: UserDTO): ProfileFormValues {
  return {
    fullName: user?.fullName || "",
    email: user?.email || "",
    profilePic: user?.profilePic || "",
    bio: user?.bio || "",
  }
}
