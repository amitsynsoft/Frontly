"use client"

import { FileText } from "lucide-react"
import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CustomerNotesProps {
  notes?: string
}

export function CustomerNotes({ notes }: CustomerNotesProps) {
  if (!notes) return null

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/30 bg-card shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <CardHeader className="border-b border-border/20 bg-muted/10 pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          Customer Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="rounded-xl border border-border/20 bg-muted/10 p-4 text-sm leading-relaxed text-foreground/80 italic">
          &ldquo;{notes}&rdquo;
        </div>
      </CardContent>
    </Card>
  )
}
