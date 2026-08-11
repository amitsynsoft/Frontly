import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { AuthSession, AuthState } from "@/store/slice/auth/auth-types"

const initialState: AuthState = {
  session: null,
  accessToken: null,
  refreshToken: null,
  status: "unauthenticated",
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        session: AuthSession
        accessToken: string
        refreshToken?: string
      }>
    ) => {
      state.session = action.payload.session
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken ?? null
      state.status = "authenticated"
    },
    clearCredentials: (state) => {
      state.session = null
      state.accessToken = null
      state.refreshToken = null
      state.status = "unauthenticated"
    },
  },
})

export const { clearCredentials, setCredentials } = authSlice.actions
export const authReducer = authSlice.reducer
