"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import { PageContainer } from "@/components/layouts/page-container"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useGetBranchServicesQuery } from "@/store/api/branchservices.api"
import { useGetLocationsQuery } from "@/store/api/location.api"
import {
  useCreateStaffServiceMutation,
  useGetStaffServicesQuery,
  useUpdateStaffServiceMutation,
} from "@/store/api/staff-service.api"
import { useGetUserByIdQuery } from "@/store/api/user.api"

import { getApiList } from "@/hooks/useApiListData"

import { ServicesForm } from "./_components/services-form"
import { useResponsive } from "@/hooks/useResponsive"

interface UserServicesPageProps {
  params: Promise<{ id: string }>
}

export default function UserServicesPage({ params }: UserServicesPageProps) {
  const router = useRouter()
  const { id } = React.use(params)
  const userId = Number(id)
  const { isMobile } = useResponsive()

  // 1. Fetch User details
  const {
    data: userRaw,
    isLoading: isLoadingUser,
    error: userError,
  } = useGetUserByIdQuery(userId)

  const userData = React.useMemo(() => {
    if (!userRaw) return undefined
    return (userRaw as any).result || (userRaw as any).data || userRaw
  }, [userRaw])

  // 2. Fetch Assigned Services for User
  const {
    data: currentAssignmentsRaw,
    isLoading: isLoadingAssignments,
    refetch: refetchAssignments,
  } = useGetStaffServicesQuery({ tenantUserId: userId, all: true })

  const assignmentsList = React.useMemo(() => {
    return getApiList<any>(currentAssignmentsRaw)
  }, [currentAssignmentsRaw])

  // 3. Fetch Available Branch Services
  const { data: servicesRaw, isLoading: isLoadingServices } =
    useGetBranchServicesQuery(
      {
        tenantId: userData?.tenantId ? Number(userData.tenantId) : undefined,
        all: true,
      },
      {
        skip: !userData?.tenantId,
      }
    )

  const availableServices = React.useMemo(() => {
    return getApiList<any>(servicesRaw)
  }, [servicesRaw])

  // 4. Fetch Organization branches (Locations)
  const { data: locationsRaw, isLoading: isLoadingLocations } =
    useGetLocationsQuery(
      {
        tenantId: userData?.tenantId ? String(userData.tenantId) : undefined,
        all: true,
      },
      {
        skip: !userData?.tenantId,
      }
    )

  const branchesList = React.useMemo(() => {
    return getApiList<any>(locationsRaw)
  }, [locationsRaw])

  // Mutations
  const [createStaffService, { isLoading: isCreating }] =
    useCreateStaffServiceMutation()
  const [updateStaffService, { isLoading: isUpdating }] =
    useUpdateStaffServiceMutation()
  const isSaving = isCreating || isUpdating

  const handleSave = async (branchServiceIds: number[]) => {
    try {
      if (assignmentsList.length === 0) {
        // Create new assignments list
        await createStaffService({
          tenantUserId: userId,
          branchServiceIds,
        }).unwrap()
      } else {
        // Update existing assignments list
        await updateStaffService({
          tenantUserId: userId,
          body: { branchServiceIds },
        }).unwrap()
      }
      refetchAssignments()

      router.push("/dashboard/user")
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to update assignments."
    }
  }

  const isLoading =
    isLoadingUser ||
    isLoadingServices ||
    isLoadingAssignments ||
    isLoadingLocations

  return (
    <PageContainer>
      {/* Back Link & Header */}
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          className="w-fit gap-1.5 pl-0 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/dashboard/user")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Assign Services</h1>
        <p className="text-sm text-muted-foreground">
          Select branch services to assign to this user account.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="h-64 animate-pulse rounded-lg border border-border/50 bg-muted/40" />
        </div>
      ) : userError || !userData ? (
        <Card className="border-destructive/20 bg-destructive/5 text-destructive">
          <CardHeader>
            <CardTitle>User Details Failed to Load</CardTitle>
            <CardDescription className="text-destructive/80">
              Please return to the user list and try again.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="border border-border/50 bg-background/50 shadow-xl backdrop-blur-sm">
          <ServicesForm
            userData={userData}
            availableServices={availableServices}
            assignmentsList={assignmentsList}
            branchesList={branchesList}
            onSave={handleSave}
            isSaving={isSaving}
            onCancel={() => router.push("/dashboard/user")}
            size={isMobile ? "sm" : "lg"}
          />
        </Card>
      )}
    </PageContainer>
  )
}
