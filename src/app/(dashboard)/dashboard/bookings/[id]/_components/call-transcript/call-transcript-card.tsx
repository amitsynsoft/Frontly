"use client"

import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"

import { DEFAULT_TRANSCRIPT_DATA } from "./call-transcript.config"
import { TranscriptData } from "./call-transcript.types"
import { formatTranscriptForClipboard } from "./call-transcript.utils"
import { ChatBubbleList } from "./components/chat-bubble-list"
import { ExtractedInsights } from "./components/extracted-insights"
import { TranscriptHeader } from "./components/transcript-header"

interface CallTranscriptCardProps {
  customData?: Partial<TranscriptData>
}

export function CallTranscriptCard({ customData }: CallTranscriptCardProps) {
  const data: TranscriptData = {
    ...DEFAULT_TRANSCRIPT_DATA,
    ...customData,
  }

  const [activeTab, setActiveTab] = React.useState<"transcript" | "insights">(
    "transcript"
  )
  const [isCopied, setIsCopied] = React.useState(false)

  const handleCopyTranscript = React.useCallback(async () => {
    try {
      const textToCopy = formatTranscriptForClipboard(
        data.messages,
        data.scenario
      )
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // Fallback if clipboard API fails
      setIsCopied(false)
    }
  }, [data.messages, data.scenario])

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/30 bg-card shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      {/* Header & Controls */}
      <TranscriptHeader
        scenario={data.scenario}
        callDuration={data.callDuration}
        callDate={data.callDate}
        agentName={data.agentName}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCopyTranscript={handleCopyTranscript}
        isCopied={isCopied}
        totalMessagesCount={data.messages.length}
      />

      {/* Main Content Area */}
      <CardContent className="p-5">
        {activeTab === "transcript" ? (
          <ChatBubbleList messages={data.messages} />
        ) : (
          <ExtractedInsights info={data.capturedInfo} />
        )}
      </CardContent>
    </Card>
  )
}
