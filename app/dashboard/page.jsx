"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = "/login"
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Role:</strong> {user?.role}</p>
                  <p><strong>Branch:</strong> {user?.branch_id || 'Not assigned'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    View Profile
                  </Button>
                  <Button className="w-full" variant="outline">
                    Settings
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Authentication</span>
                    <span className="text-green-600 font-medium">✓ Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Connection</span>
                    <span className="text-green-600 font-medium">✓ Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Session</span>
                    <span className="text-green-600 font-medium">✓ Valid</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Development Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Authentication Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
