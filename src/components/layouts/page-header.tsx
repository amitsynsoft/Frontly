import { Button } from "@/components/ui/button"

type PageHeaderProps = {
  title: string
  description: string
  actionLabel?: string
  actionIcon?: React.ReactNode
  onAction?: () => void
}

function PageHeader({
  actionLabel,
  description,
  title,
  actionIcon,
  onAction,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-normal text-foreground md:text-3xl">
          {title}
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {actionLabel ? (
        <Button type="button" className="w-fit" onClick={onAction}>
          {actionIcon ? (
            <span data-icon="inline-start">{actionIcon}</span>
          ) : null}
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

export { PageHeader }
