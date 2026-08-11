import { Search } from "lucide-react"
import * as React from "react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ServicesFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedBranchId: string
  onBranchChange: (value: string) => void
  branches: { id: string; name: string }[]
}

export function ServicesFilter({
  searchTerm,
  onSearchChange,
  selectedBranchId,
  onBranchChange,
  branches,
}: ServicesFilterProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9"
          />
        </div>

        {/* Branch Selection */}
        <div className="w-full sm:max-w-xs">
          <Select value={selectedBranchId} onValueChange={onBranchChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
