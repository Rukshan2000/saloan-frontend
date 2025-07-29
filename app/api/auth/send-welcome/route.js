import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ success: false, message: "Email and name are required" }, { status: 400 })
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Welcome email template
    const mailOptions = {
      from: `"ZenSlot" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to ZenSlot - Let's Make a Difference Together!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ZenSlot</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to ZenSlot!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Helping Communities Across Sri Lanka</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${name}!</h2>
            
            <p style="margin-bottom: 25px; color: #4b5563; font-size: 16px;">
              Thank you for joining our mission to support communities across Sri Lanka! Your account has been successfully created and verified.
            </p>
            
            <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #0c4a6e; margin-top: 0;">What you can do now:</h3>
              <ul style="color: #0c4a6e; margin: 15px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">🤝 <strong>Make donations</strong> to support our ongoing campaigns</li>
                <li style="margin-bottom: 8px;">📅 <strong>Join events</strong> and volunteer opportunities</li>
                <li style="margin-bottom: 8px;">📰 <strong>Stay updated</strong> with our latest news and impact stories</li>
                <li style="margin-bottom: 8px;">👥 <strong>Connect</strong> with our community of changemakers</li>
              </ul>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <h4 style="color: #92400e; margin-top: 0;">Our Impact So Far:</h4>
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                Together with supporters like you, we've provided medical equipment to over 50 hospitals, 
                supported 1000+ patients with transportation services, and conducted 200+ health camps 
                across Sri Lanka. Thank you for being part of this journey!
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/donate" 
                 style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">
                Make Your First Donation
              </a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/campaigns" 
                 style="background: transparent; color: #f97316; padding: 15px 30px; text-decoration: none; border: 2px solid #f97316; border-radius: 6px; font-weight: bold; display: inline-block;">
                View Our Campaigns
              </a>
            </div>
            
            <p style="color: #4b5563; margin-bottom: 25px; text-align: center;">
              Have questions? Feel free to <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/contact-us" style="color: #f97316;">contact our team</a> - we're here to help!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>© 2024 ZenSlot. All rights reserved.</p>
            <p>You're receiving this because you created an account with us.</p>
            <p><a href="#" style="color: #6b7280;">Unsubscribe</a> | <a href="#" style="color: #6b7280;">Update Preferences</a></p>
          </div>
        </body>
        </html>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: "Welcome email sent successfully",
    })
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return NextResponse.json({ success: false, message: "Failed to send welcome email" }, { status: 500 })
  }
}
