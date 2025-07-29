import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// In-memory storage for OTPs (use Redis or database in production)
const otpStorage = new Map()

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request) {
  try {
    const { email, name, resend = false } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ success: false, message: "Email and name are required" }, { status: 400 })
    }

    // Generate new OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Store OTP
    otpStorage.set(email, {
      otp,
      expiresAt,
      attempts: 0,
      verified: false,
    })

    // Create transporter (configure with your email service)
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email template
    const mailOptions = {
      from: `"ZenSlot" <${process.env.SMTP_USER}>`,
      to: email,
      subject: resend ? "New Verification Code - ZenSlot" : "Verify Your Email - ZenSlot",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">ZenSlot</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Helping Communities Across Sri Lanka</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${name}!</h2>
            
            <p style="margin-bottom: 25px; color: #4b5563;">
              ${resend ? "Here is your new verification code:" : "Thank you for joining ZenSlot! Please use the verification code below to complete your account setup:"}
            </p>
            
            <div style="background: #f3f4f6; border: 2px dashed #f97316; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #f97316; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
              <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">
                This code will expire in 5 minutes
              </p>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>Security Note:</strong> Never share this code with anyone. ZenSlot will never ask for your verification code via phone or email.
              </p>
            </div>
            
            <p style="color: #4b5563; margin-bottom: 25px;">
              If you didn't request this verification code, please ignore this email or contact our support team.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" 
                 style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Visit ZenSlot
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>© 2024 ZenSlot. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </body>
        </html>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ success: false, message: "Failed to send OTP" }, { status: 500 })
  }
}
