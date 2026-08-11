import { SpeakerRole, TranscriptMessage } from "./call-transcript.types"

export function filterTranscriptMessages(
  messages: TranscriptMessage[],
  searchQuery: string,
  speakerFilter: SpeakerRole | "ALL"
): TranscriptMessage[] {
  const query = searchQuery.trim().toLowerCase()

  return messages.filter((msg) => {
    // Speaker filter check
    if (speakerFilter !== "ALL" && msg.speaker !== speakerFilter) {
      return false
    }

    // Text search check
    if (!query) return true

    const textMatch = msg.text.toLowerCase().includes(query)
    const speakerMatch = msg.speakerName.toLowerCase().includes(query)
    const timestampMatch = msg.timestamp.includes(query)

    return textMatch || speakerMatch || timestampMatch
  })
}

export function formatTranscriptForClipboard(
  messages: TranscriptMessage[],
  scenario: string
): string {
  const header = `Dental Appointment Booking Call Transcript\nScenario: ${scenario}\n${"─".repeat(50)}\n\n`
  const body = messages
    .map((m) => {
      if (m.isSystemEvent) {
        return `[${m.timestamp}] SYSTEM: ${m.text}`
      }
      return `[${m.timestamp}] ${m.speakerName}:\n${m.text}`
    })
    .join("\n\n")

  return `${header}${body}`
}
