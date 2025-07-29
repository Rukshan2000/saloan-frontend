import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./api/api_slice"

import authReducer from "./auth/auth_slice"
import loginReducer from "./auth/login_slice"

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    login: loginReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
})
