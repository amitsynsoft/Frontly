import { z } from "zod"

import type {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UserDTO,
} from "@/types/dtos/user.dto"

export const userFormSchema = z.object({
  id: z.number().optional(),
  email: z.string().email("Invalid email address"),
  fullName: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  tenantId: z.string().min(1, "Tenant is required"),
  roleId: z.string().min(1, "Role is required"),
  tenantUserLevelId: z.string().optional().or(z.literal("")),
  tenantUserDesignationId: z.string().min(1, "Designation is required"),
  profilePic: z.string().url("Enter a valid URL").or(z.literal("")),
  bio: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["Active", "InActive"] as const),
})

export type UserFormValues = z.infer<typeof userFormSchema>

export function getUserDefaultValues(
  user?: UserDTO,
  defaultTenantId = ""
): UserFormValues {
  if (user) {
    return {
      id: user.id,
      email: user.email || "",
      fullName: user.fullName || "",
      tenantId: String(user.tenantId ?? defaultTenantId),
      roleId: user.roles && user.roles[0] ? String(user.roles[0].id) : "",
      tenantUserLevelId: user.tenantUserLevelId
        ? String(user.tenantUserLevelId)
        : "",
      tenantUserDesignationId: user.tenantUserDesignationId
        ? String(user.tenantUserDesignationId)
        : "",
      profilePic: user.profilePic ?? "",
      bio: user.bio ?? "",
      status: user.status === "InActive" ? "InActive" : "Active",
    }
  }

  return {
    email: "",
    fullName: "",
    tenantId: defaultTenantId,
    roleId: "",
    tenantUserLevelId: "",
    tenantUserDesignationId: "",
    profilePic: "",
    bio: "",
    status: "Active",
  }
}

export function toUserPayload(
  values: UserFormValues,
  isEdit: boolean
): CreateUserRequestDto | UpdateUserRequestDto {
  const payload: CreateUserRequestDto | UpdateUserRequestDto = {
    tenantId: Number(values.tenantId),
    email: values.email.trim(),
    fullName: values.fullName || "",
    roleId: Number(values.roleId),
    profilePic: values.profilePic.trim(),
    status: values.status,
    bio: values.bio?.trim() || "",
  }

  if (values.tenantUserLevelId) {
    payload.tenantUserLevelId = Number(values.tenantUserLevelId)
  }

  if (values.tenantUserDesignationId) {
    payload.tenantUserDesignationId = Number(values.tenantUserDesignationId)
  }

  return payload
}
