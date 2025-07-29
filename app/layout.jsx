import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Navbar } from "../components/Navbar"
import LayoutWithAuth from "../components/LayoutWithAuth"
// import { Footer } from "../components/Footer"

const inter = Inter({ subsets: ["latin"] })


export const metadata = {
  title: "ZenSlot - Supporting People Across Sri Lanka",
  description:
    "We are here to support people from every corner of Sri Lanka with medical assistance and humanitarian aid.",
  generator: 'v0.dev'
}

// Duplicate LayoutWithAuth removed

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <LayoutWithAuth>{children}</LayoutWithAuth>
        </Providers>
      </body>
    </html>
  )
}

// (moved to components/LayoutWithAuth.jsx)
