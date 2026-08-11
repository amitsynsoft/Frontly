"use client"

import { ProgressProvider } from "@bprogress/next/app"

const BProgressProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="3px"
      color="var(--primary)"
      options={{ showSpinner: false }}
      shallowRouting
      delay={0}
      stopDelay={300}
    >
      {children}
    </ProgressProvider>
  )
}

export default BProgressProviders
