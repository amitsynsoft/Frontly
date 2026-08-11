import { WebsiteLoader } from "@/components/shared/website-loader"
import { cn } from "@/lib/utils/cn.utils"

type LoadingScreenProps = {
  className?: string
  description?: string
  label?: string
}

function LoadingScreen({ className, description, label }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "grid min-h-svh place-items-center bg-background p-6",
        className
      )}
    >
      <WebsiteLoader
        label={label}
        description={description}
        className="w-full max-w-md"
      />
    </div>
  )
}

export { LoadingScreen }
