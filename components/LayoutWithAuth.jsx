"use client"
import { Navbar } from "./Navbar"
import { useAuth } from "@/contexts/AuthContext"

export default function LayoutWithAuth({ children }) {
  const { user } = useAuth()
  return (
    <div className="min-h-screen flex flex-row">
      {user && <Navbar />}
      <div className="flex-1 flex flex-col">
        <main className="flex-1">{children}</main>
        {/* <Footer /> */}
      </div>
    </div>
  )
}
