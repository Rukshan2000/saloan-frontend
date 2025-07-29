"use client"
import { Navbar } from "./Navbar"
import { useSelector } from "react-redux"

export default function LayoutWithAuth({ children }) {
  const user = useSelector(state => state.login.user)
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
