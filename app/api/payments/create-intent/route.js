import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request) {
  // --- NEW: fail-safe when Stripe keys are absent -----------------
  if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return NextResponse.json(
      {
        success: false,
        needsStripeKeys: true,
        message:
          "Stripe environment variables are not set in this preview. " +
          "Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local.",
      },
      { status: 200 }, // return 200 so client can handle normally
    )
  }
  // ----------------------------------------------------------------

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  })

  try {
    const { amount, currency = "lkr", donorInfo, donationType } = await request.json()

    // Validate amount (minimum 100 LKR)
    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        donorName: donorInfo.name,
        donorEmail: donorInfo.email,
        donorPhone: donorInfo.phone || "",
        donationType: donationType,
        message: donorInfo.message || "",
        anonymous: donorInfo.anonymous ? "true" : "false",
      },
      receipt_email: donorInfo.email,
      description: `Donation to ZenSlot - ${donationType}`,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
