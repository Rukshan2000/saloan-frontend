"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { authApi } from "@/lib/api"
import { useCreateUserMutation } from "@/redux/features/usersApi"

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1) // 1: Form, 2: Success
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: 3, // Default to customer role
    branch_id: "", // Optional, can be set if needed
    agreeToTerms: false,
  })
  const [addUser] = useCreateUserMutation()
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      await addUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role_id: formData.role, // Send as role_id
        branch_id: formData.branch_id || null,
      }).unwrap()
      setCurrentStep(2) // Show success
    } catch (error) {
      setErrors({ general: error.message || "Failed to create account" })
    } finally {
      setIsLoading(false)
    }
  }

  const renderSignupForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Create Account</CardTitle>
        <p className="text-center text-gray-600">Fill in your details to get started</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{errors.general}</AlertDescription>
            </Alert>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
              placeholder="john.doe@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "border-red-500" : ""}
              placeholder="Enter a strong password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "border-red-500" : ""}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked })}
                className={errors.agreeToTerms ? "border-red-500" : ""}
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                I agree to the{" "}
                <Link href="/terms" className="text-orange-500 hover:text-orange-600">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-orange-500 hover:text-orange-600">
                  Privacy Policy
                </Link>{" "}
                *
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  const renderSuccess = () => (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Account Created Successfully!</h3>
        <p className="text-green-700 mb-6">
          Welcome to ZenSlot! Your account has been created successfully.
        </p>
        <div className="space-y-4">
          <Link href="/login">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Sign In to Your Account</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">DS</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">ZenSlot</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-gray-600">
            Join our community and help us make a difference
          </p>
        </div>

        {currentStep === 1 && renderSignupForm()}
        {currentStep === 2 && renderSuccess()}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
