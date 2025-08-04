"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-red-800">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-red-700 mb-6">
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
            
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Login with Different Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
