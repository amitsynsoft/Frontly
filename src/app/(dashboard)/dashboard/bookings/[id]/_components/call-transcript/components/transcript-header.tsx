"use client"

import { Bot, Check, Clock, Copy, MessageSquare, Sparkles } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TranscriptHeaderProps {
  scenario: string
  callDuration: string
  callDate: string
  agentName: string
  activeTab: "transcript" | "insights"
  onTabChange: (tab: "transcript" | "insights") => void
  onCopyTranscript: () => void
  isCopied: boolean
  totalMessagesCount: number
}

export function TranscriptHeader({
  scenario,
  callDuration,
  callDate,
  agentName,
  activeTab,
  onTabChange,
  onCopyTranscript,
  isCopied,
  totalMessagesCount,
}: TranscriptHeaderProps) {
  return (
    <div className="space-y-4 border-b border-border/20 bg-muted/10 p-5">
      {/* ── Top Row: Title, Meta Info, Actions ──────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Title & Status */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">
                FrontDeskAI™ Call Transcript
              </h3>
              <Badge
                variant="outline"
                className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Completed
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{scenario}</p>
          </div>
        </div>

        {/* Right Info Pills & Copy Action */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-border/30 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground shadow-xs sm:flex">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold text-foreground">
              {callDuration}
            </span>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-1">
        <div className="inline-flex h-9 items-center justify-center rounded-xl bg-muted/50 p-1 text-muted-foreground">
          <button
            type="button"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all ${
              activeTab === "transcript"
                ? "bg-background text-foreground shadow-xs"
                : "hover:text-foreground"
            }`}
            onClick={() => onTabChange("transcript")}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Conversation Stream</span>
            <Badge
              variant="secondary"
              className="ml-1 h-4 rounded-full px-1.5 text-[10px] font-medium"
            >
              {totalMessagesCount}
            </Badge>
          </button>

          <button
            type="button"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all ${
              activeTab === "insights"
                ? "bg-background text-foreground shadow-xs"
                : "hover:text-foreground"
            }`}
            onClick={() => onTabChange("insights")}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Extracted AI Summary</span>
          </button>
        </div>
      </div>
    </div>
  )
}
