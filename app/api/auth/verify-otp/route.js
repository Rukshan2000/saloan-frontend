import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// In-memory storage for OTPs (use Redis or database in production)
const otpStorage = new Map()
const users = new Map() // Temporary user storage (use database in production)

export async function POST(request) {
  try {
    const { email, otp, userData } = await request.json()

    if (!email || !otp || !userData) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Check if OTP exists
    const storedOtpData = otpStorage.get(email)
    if (!storedOtpData) {
      return NextResponse.json({ success: false, message: "OTP not found or expired" }, { status: 400 })
    }

    // Check if OTP is expired
    if (new Date() > storedOtpData.expiresAt) {
      otpStorage.delete(email)
      return NextResponse.json({ success: false, message: "OTP has expired" }, { status: 400 })
    }

    // Check attempts
    if (storedOtpData.attempts >= 3) {
      otpStorage.delete(email)
      return NextResponse.json({ success: false, message: "Too many failed attempts" }, { status: 400 })
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      storedOtpData.attempts += 1
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 })
    }

    // Check if user already exists
    if (users.has(email)) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Create user account
    const newUser = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      password: hashedPassword,
      subscribeNewsletter: userData.subscribeNewsletter,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      role: "user",
      status: "active",
    }

    // Store user (in production, save to database)
    users.set(email, newUser)

    // Clean up OTP
    otpStorage.delete(email)

    // Send welcome email (optional)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/send-welcome`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newUser.email,
          name: `${newUser.firstName} ${newUser.lastName}`,
        }),
      })
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
      // Don't fail the registration if welcome email fails
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
      },
    })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ success: false, message: "Failed to verify OTP" }, { status: 500 })
  }
}
