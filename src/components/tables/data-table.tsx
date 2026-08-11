"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  TableMeta,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { AlertCircle, Loader2 } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils/cn.utils"
import dayjs from "dayjs"
import { parseLocalDate, formatCurrency } from "@/lib/utils/formatters"

import { StatusBadge } from "../shared/status-badge"
import { DataTablePagination } from "./data-table-pagination"

type DataTableColumnOptions = {
  className?: string
  headerClassName?: string
  truncate?: boolean
  align?: "left" | "center" | "right"
}

export interface DataTableColumn<TData> {
  key: string
  header: React.ReactNode
  type?:
    | "mono"
    | "dateTime"
    | "date"
    | "status"
    | "currency"
    | "number"
    | string
  cell?: (value: unknown, row: TData, meta?: any) => React.ReactNode
  className?: string
  headerClassName?: string
  truncate?: boolean
  align?: "left" | "center" | "right"
  enableSorting?: boolean
}

interface DataTableProps<TData, TValue> {
  columns: (DataTableColumn<TData> | ColumnDef<TData, TValue>)[]
  data: TData[]
  searchKey?: string
  meta?: TableMeta<TData>
  // External pagination props (optional for local/client pagination)
  pageCount?: number
  pageIndex?: number
  pageSize?: number
  onPaginationChange?: (pagination: {
    pageIndex: number
    pageSize: number
  }) => void
  isLoading?: boolean
  isPaginationEnabled?: boolean
  error?: unknown
  emptyMessage?: string
  emptyDescription?: string
  errorTitle?: string
  errorMessage?: string
  tableClassName?: string
  containerClassName?: string
  // External selection props
  rowSelection?: Record<string, boolean>
  onRowSelectionChange?: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getValueByKey<TData>(row: TData, key: string) {
  if (!key || key === "actions") {
    return undefined
  }

  if (key.includes(".")) {
    return key.split(".").reduce<unknown>((value, path) => {
      if (!isRecord(value)) {
        return undefined
      }

      return value[path]
    }, row)
  }

  if (!isRecord(row)) {
    return undefined
  }

  return row[key]
}

function renderDefaultCell(value: unknown, type?: string) {
  if (value === undefined || value === null || value === "") return "-"

  switch (type) {
    case "mono":
      return <span className="font-mono">{String(value)}</span>

    case "date": {
      const dateVal =
        value instanceof Date ? value : parseLocalDate(String(value))
      if (!dateVal) return String(value)
      return dayjs(dateVal).format("MMM D, YYYY")
    }

    case "dateTime": {
      const date = value instanceof Date ? value : new Date(String(value))
      if (isNaN(date.getTime())) return String(value)
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    }

    case "status": {
      const statusStr = String(value)
      let badgeVariant: "default" | "secondary" | "destructive" | "outline" =
        "outline"
      const lower = statusStr.toLowerCase()
      if (
        lower === "active" ||
        lower === "confirmed" ||
        lower === "completed" ||
        lower === "success"
      ) {
        badgeVariant = "default"
      } else if (
        lower === "inactive" ||
        lower === "cancelled" ||
        lower === "failed" ||
        lower === "deleted" ||
        lower === "inactive"
      ) {
        badgeVariant = "destructive"
      } else if (
        lower === "pending" ||
        lower === "scheduled" ||
        lower === "warning"
      ) {
        badgeVariant = "secondary"
      }
      return <StatusBadge status={statusStr} />
    }

    case "currency": {
      const num = Number(value)
      if (isNaN(num)) return String(value)
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(num)
    }

    case "number": {
      const num = Number(value)
      if (isNaN(num)) return String(value)
      return num.toLocaleString()
    }

    default:
      return String(value)
  }
}

function mapColumnsToColumnDefs<TData>(
  columns: (DataTableColumn<TData> | ColumnDef<TData, unknown>)[]
): ColumnDef<TData, unknown>[] {
  return columns.map((col) => {
    // If it's already a standard ColumnDef, use it directly
    if ("accessorKey" in col || "accessorFn" in col || "id" in col) {
      return col as ColumnDef<TData, unknown>
    }

    const dtCol = col as DataTableColumn<TData>

    const mapped: ColumnDef<TData, unknown> = {
      id: dtCol.key,
      accessorFn: (row) => getValueByKey(row, dtCol.key),
      header: () => dtCol.header,
      enableSorting: dtCol.enableSorting !== false,
      cell: (info) => {
        const row = info.row.original
        const value = info.getValue()

        if (dtCol.cell) {
          return dtCol.cell(value, row)
        }

        return renderDefaultCell(value, dtCol.type)
      },
    }

    // Attach custom options for usage in our cell rendering loop
    Object.assign(mapped, {
      className: dtCol.className,
      headerClassName: dtCol.headerClassName,
      align: dtCol.align,
      truncate: dtCol.truncate,
    })

    return mapped
  })
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const {
    columns: rawColumns,
    data,
    meta,
    pageCount,
    pageIndex,
    pageSize,
    onPaginationChange,
    isLoading,
    isPaginationEnabled = true,
    error,
    emptyMessage,
    emptyDescription,
    errorTitle,
    errorMessage,
    tableClassName,
    containerClassName,
  } = props

  const columns = React.useMemo(
    () =>
      mapColumnsToColumnDefs(
        rawColumns as (DataTableColumn<TData> | ColumnDef<TData, unknown>)[]
      ),
    [rawColumns]
  )

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [internalRowSelection, setInternalRowSelection] = React.useState<
    Record<string, boolean>
  >({})

  const actualRowSelection =
    props.rowSelection !== undefined ? props.rowSelection : internalRowSelection
  const handleRowSelectionChange =
    props.onRowSelectionChange || setInternalRowSelection

  const pagination = React.useMemo(
    () => ({
      pageIndex: pageIndex ?? 0,
      pageSize: pageSize ?? 10,
    }),
    [pageIndex, pageSize]
  )

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleRowSelectionChange,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const nextPagination = updater(pagination)
        onPaginationChange?.(nextPagination)
      } else {
        onPaginationChange?.(updater)
      }
    },
    manualPagination: pageCount !== undefined,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: actualRowSelection,
      pagination,
    },
    meta,
  })

  return (
    <div className="space-y-5">
      <div
        className={cn(
          "relative w-full overflow-auto rounded-xl border border-border bg-card shadow-xs",
          containerClassName
        )}
      >
        <Table
          className={cn("min-w-full text-sm lg:min-w-[700px]", tableClassName)}
        >
          {/* HEADER */}
          <TableHeader className="sticky top-0 z-10 bg-secondary/40 shadow-xs dark:bg-zinc-900/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-border hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  const columnDef = header.column.columnDef as ColumnDef<
                    TData,
                    unknown
                  > &
                    DataTableColumnOptions
                  const headerClassName = columnDef.headerClassName || ""
                  const align = columnDef.align || "left"
                  const alignClass =
                    align === "right"
                      ? "text-right"
                      : align === "center"
                        ? "text-center"
                        : "text-left"

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "h-12 px-4 text-[11px] font-bold tracking-wider text-primary/80 uppercase",
                        alignClass,
                        headerClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-60 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-60 text-center text-destructive"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <p className="text-sm font-bold text-destructive">
                      {errorTitle || "Something went wrong"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {errorMessage ||
                        (typeof error === "string"
                          ? error
                          : "Unable to load data. Please check your connection.")}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-primary/10"
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnDef = cell.column.columnDef as ColumnDef<
                      TData,
                      unknown
                    > &
                      DataTableColumnOptions
                    const className = columnDef.className || ""
                    const align = columnDef.align || "left"
                    const truncate = columnDef.truncate
                    const alignClass =
                      align === "right"
                        ? "text-right"
                        : align === "center"
                          ? "text-center"
                          : "text-left"

                    const cellContent = flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "px-4 py-3 text-foreground",
                          alignClass,
                          className
                        )}
                      >
                        {truncate ? (
                          <div
                            className="truncate"
                            title={
                              typeof cellContent === "string"
                                ? cellContent
                                : undefined
                            }
                          >
                            {cellContent}
                          </div>
                        ) : (
                          cellContent
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-medium">
                      {emptyMessage || "No results."}
                    </p>
                    {emptyDescription && (
                      <p className="text-xs text-muted-foreground">
                        {emptyDescription}
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {isPaginationEnabled && data?.length > 0 && (
        <div className="flex items-center justify-between">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  )
}
