import AuthGuard from "@/components/auth/AuthGuard"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard publicPage>{children}</AuthGuard>
}
