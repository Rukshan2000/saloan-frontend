import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

export async function POST(request) {
  try {
    const { paymentIntentId, donationData } = await request.json()

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // Here you would typically save the donation to your database
    // For now, we'll simulate this with a mock response
    const donation = {
      id: `don_${Date.now()}`,
      amount: donationData.amount,
      currency: "LKR",
      type: donationData.donationType,
      donor: donationData.donorInfo,
      paymentIntentId: paymentIntentId,
      status: "completed",
      createdAt: new Date().toISOString(),
    }

    // You could also send confirmation emails here
    // await sendDonationConfirmationEmail(donation)

    return NextResponse.json({
      success: true,
      donationId: donation.id,
      donation: donation,
    })
  } catch (error) {
    console.error("Error confirming payment:", error)
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
