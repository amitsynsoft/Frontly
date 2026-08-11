export type SpeakerRole = "FrontDeskAI" | "Customer" | "System"

export interface TranscriptMessage {
  id: string
  speaker: SpeakerRole
  speakerName: string
  timestamp: string
  text: string
  isSystemEvent?: boolean
}

export interface FollowUpAction {
  id: string
  label: string
  completed: boolean
}

export interface CapturedInfo {
  patientName: string
  phone: string
  email: string
  patientType: string
  appointmentType: string
  insurance: string
  provider: string
  appointmentDateTime: string
  followUpActions: FollowUpAction[]
}

export interface TranscriptData {
  scenario: string
  callDuration: string
  callDate: string
  agentName: string
  agentRole: string
  messages: TranscriptMessage[]
  capturedInfo: CapturedInfo
}
