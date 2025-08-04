"use client"

import { Provider } from "react-redux"
import { store } from "../redux/store"
import { AuthProvider } from "@/contexts/AuthContext"

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  )
}
