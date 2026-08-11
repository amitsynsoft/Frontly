"use client"

import * as React from "react"
import { io, type Socket } from "socket.io-client"

type RealtimeContextValue = {
  getSocket: () => Socket | null
  isConnected: boolean
}

const RealtimeContext = React.createContext<RealtimeContextValue>({
  getSocket: () => null,
  isConnected: false,
})

function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const socketRef = React.useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = React.useState(false)

  React.useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL

    if (!socketUrl) {
      return
    }

    const client = io(socketUrl, {
      autoConnect: false,
      transports: ["websocket"],
    })

    client.on("connect", () => setIsConnected(true))
    client.on("disconnect", () => setIsConnected(false))
    client.connect()
    socketRef.current = client

    return () => {
      socketRef.current = null
      client.disconnect()
    }
  }, [])

  const getSocket = React.useCallback(() => socketRef.current, [])

  const value = React.useMemo(
    () => ({
      getSocket,
      isConnected,
    }),
    [getSocket, isConnected]
  )

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  )
}

function useRealtime() {
  return React.useContext(RealtimeContext)
}

export { RealtimeProvider, useRealtime }
