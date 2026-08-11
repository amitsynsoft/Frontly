import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import { authReducer } from "@/store/slice/auth/auth-slice"
import { api } from "@/store/api/api.config"

import { rtkQueryLogger } from "./api/api.util"
import userReducer from "./slice/user/user.slice"

export function makeStore() {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [api.reducerPath]: api.reducer,
      user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware, rtkQueryLogger),
  })

  setupListeners(store.dispatch)

  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
