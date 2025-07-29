import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

export async function POST(request) {
  try {
    const { paymentIntentId, donationData } = await request.json()

    if (!paymentIntentId || !donationData) {
      return NextResponse.json({ success: false, message: "Missing required data" }, { status: 400 })
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ success: false, message: "Payment not completed" }, { status: 400 })
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

    const receiptDate = new Date().toLocaleDateString()
    const receiptNumber = `DS-${Date.now()}`

    // Email template
    const mailOptions = {
      from: `"ZenSlot" <${process.env.SMTP_USER}>`,
      to: donationData.donorInfo.email,
      subject: `Donation Receipt - Thank You for Your Generous Contribution`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Donation Receipt</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">ZenSlot</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Donation Receipt</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Thank You, ${donationData.donorInfo.name}!</h2>
            
            <p style="margin-bottom: 25px; color: #4b5563; font-size: 16px;">
              We are deeply grateful for your generous donation. Your contribution will make a real difference in the lives of people across Sri Lanka.
            </p>
            
            <!-- Receipt Details -->
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin: 25px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <div>
                  <h3 style="color: #1f2937; margin: 0 0 10px 0;">Receipt Details</h3>
                  <p style="margin: 5px 0; color: #4b5563;"><strong>Receipt #:</strong> ${receiptNumber}</p>
                  <p style="margin: 5px 0; color: #4b5563;"><strong>Date:</strong> ${receiptDate}</p>
                  <p style="margin: 5px 0; color: #4b5563;"><strong>Transaction ID:</strong> ${paymentIntentId}</p>
                </div>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 18px; color: #1f2937;"><strong>Donation Amount:</strong></span>
                  <span style="font-size: 24px; font-weight: bold; color: #f97316;">LKR ${donationData.amount.toLocaleString()}</span>
                </div>
                <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">
                  Type: ${donationData.donationType === "one-time" ? "One-time" : "Monthly"} Donation
                </p>
              </div>
            </div>
            
            ${
              donationData.donorInfo.message
                ? `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <h4 style="color: #92400e; margin-top: 0;">Your Message:</h4>
              <p style="margin: 0; color: #92400e; font-style: italic;">"${donationData.donorInfo.message}"</p>
            </div>
            `
                : ""
            }
            
            <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #065f46; margin-top: 0;">Tax Information</h4>
              <p style="margin: 0; color: #065f46; font-size: 14px;">
                This donation is tax-deductible. Please keep this receipt for your records. 
                Our tax ID is 123456789 (Sample).
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <h3 style="color: #1f2937; margin-bottom: 15px;">Your Impact</h3>
              <p style="color: #4b5563; margin-bottom: 20px;">
                Your donation of LKR ${donationData.amount.toLocaleString()} will help us:
              </p>
              <ul style="text-align: left; color: #4b5563; margin: 0 auto; display: inline-block;">
                <li>Provide medical equipment to rural hospitals</li>
                <li>Support patient transportation services</li>
                <li>Fund health camps in underserved communities</li>
                <li>Supply essential medications to those in need</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/campaigns" 
                 style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">
                View Our Other Campaigns
              </a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/donate" 
                 style="background: transparent; color: #f97316; padding: 15px 30px; text-decoration: none; border: 2px solid #f97316; border-radius: 6px; font-weight: bold; display: inline-block;">
                Make Another Donation
              </a>
            </div>
            
            <p style="color: #4b5563; margin-bottom: 25px; text-align: center;">
              Questions about your donation? Contact us at <a href="mailto:support@divisarana.org" style="color: #f97316;">support@divisarana.org</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>© 2024 ZenSlot. All rights reserved.</p>
            <p>ZenSlot | Colombo, Sri Lanka | +94 77 123 4567</p>
            <p>This is an official donation receipt for tax purposes.</p>
          </div>
        </body>
        </html>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: "Receipt sent successfully",
    })
  } catch (error) {
    console.error("Error sending receipt:", error)
    return NextResponse.json({ success: false, message: "Failed to send receipt" }, { status: 500 })
  }
}
