"use client"

import { Bot, User } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"

import { TranscriptMessage } from "../call-transcript.types"

interface ChatBubbleListProps {
  messages: TranscriptMessage[]
}

export function ChatBubbleList({ messages }: ChatBubbleListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/40 bg-muted/10 p-6 text-center text-muted-foreground">
        <p className="text-sm font-semibold">No dialogue messages available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 py-2">
      {messages.map((msg) => {
        // System Event formatting
        if (msg.isSystemEvent) {
          return (
            <div key={msg.id} className="my-4 flex items-center justify-center gap-3">
              <div className="h-[1px] flex-1 bg-border/40" />
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full border-border/40 bg-muted/40 px-3.5 py-1 text-[11px] font-medium text-muted-foreground shadow-xs"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500/80 animate-pulse" />
                {msg.text}
              </Badge>
              <div className="h-[1px] flex-1 bg-border/40" />
            </div>
          )
        }

        const isAI = msg.speaker === "FrontDeskAI"

        return (
          <div
            key={msg.id}
            className={`flex w-full items-start gap-3 ${
              isAI ? "flex-row" : "flex-row-reverse"
            }`}
          >
            {/* Avatar Badge */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform duration-200 hover:scale-105 ${
                isAI
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground border border-border/40"
              }`}
            >
              {isAI ? (
                <Bot className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>

            {/* Bubble Content Box */}
            <div
              className={`group max-w-[85%] sm:max-w-[78%] space-y-1 ${
                isAI ? "items-start" : "items-end text-right"
              }`}
            >
              {/* Speaker Metadata Line */}
              <div
                className={`flex items-center gap-2 px-1 text-xs text-muted-foreground ${
                  isAI ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <span className="font-semibold text-foreground/90">
                  {msg.speakerName}
                </span>
                {isAI && (
                  <Badge
                    variant="secondary"
                    className="h-4 rounded-md bg-primary/10 px-1.5 text-[10px] font-medium text-primary border-none"
                  >
                    AI Agent
                  </Badge>
                )}
                <span className="text-[11px] text-muted-foreground/60">
                  {msg.timestamp}
                </span>
              </div>

              {/* Speech Bubble */}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all shadow-xs ${
                  isAI
                    ? "rounded-tl-xs bg-muted/40 text-foreground border border-border/30 hover:border-border/60"
                    : "rounded-tr-xs bg-primary text-primary-foreground hover:bg-primary/95"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
