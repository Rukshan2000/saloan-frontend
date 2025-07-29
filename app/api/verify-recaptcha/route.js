import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ success: false, message: "reCAPTCHA token is required" }, { status: 400 })
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.error("reCAPTCHA secret key not configured")
      return NextResponse.json({ success: false, message: "reCAPTCHA not configured" }, { status: 500 })
    }

    // Verify token with Google
    const verificationResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const verificationData = await verificationResponse.json()

    if (verificationData.success) {
      return NextResponse.json({
        success: true,
        score: verificationData.score,
        action: verificationData.action,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "reCAPTCHA verification failed",
        errors: verificationData["error-codes"],
      })
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 })
  }
}
