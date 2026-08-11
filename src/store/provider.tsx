"use client"

import * as React from "react"
import { Provider } from "react-redux"

import { type AppStore, makeStore } from "@/store/store"

function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = React.useState<AppStore>(() => makeStore())

  return <Provider store={store}>{children}</Provider>
}

export { StoreProvider }
