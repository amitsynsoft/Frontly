import { cn } from "@/lib/utils/cn.utils"

type PageContainerProps = {
  children: React.ReactNode
  className?: string
}

function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn("mx-auto flex w-full max-w-7xl flex-col gap-6", className)}
    >
      {children}
    </div>
  )
}

export { PageContainer }
