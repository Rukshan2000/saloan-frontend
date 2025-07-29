import { NextResponse } from "next/server"
import PDFDocument from "pdfkit"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

export async function POST(request) {
  try {
    const { paymentIntentId, donationData } = await request.json()

    if (!paymentIntentId || !donationData) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 })
    const chunks = []

    doc.on("data", (chunk) => chunks.push(chunk))
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks)
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="donation-receipt-${paymentIntentId}.pdf"`,
        },
      })
    })

    // Header
    doc.fontSize(20).fillColor("#f97316").text("ZenSlot", 50, 50)
    doc.fontSize(12).fillColor("#666").text("Helping Communities Across Sri Lanka", 50, 75)

    // Title
    doc.fontSize(18).fillColor("#000").text("DONATION RECEIPT", 50, 120)

    // Receipt details
    const receiptDate = new Date().toLocaleDateString()
    const receiptNumber = `DS-${Date.now()}`

    doc.fontSize(10).fillColor("#666")
    doc.text(`Receipt #: ${receiptNumber}`, 400, 120)
    doc.text(`Date: ${receiptDate}`, 400, 135)

    // Donor information
    doc.fontSize(14).fillColor("#000").text("Donor Information", 50, 180)
    doc.fontSize(10).fillColor("#333")
    doc.text(`Name: ${donationData.donorInfo.name}`, 50, 200)
    doc.text(`Email: ${donationData.donorInfo.email}`, 50, 215)
    if (donationData.donorInfo.phone) {
      doc.text(`Phone: ${donationData.donorInfo.phone}`, 50, 230)
    }

    // Payment information
    doc.fontSize(14).fillColor("#000").text("Payment Information", 50, 270)
    doc.fontSize(10).fillColor("#333")
    doc.text(`Transaction ID: ${paymentIntentId}`, 50, 290)
    doc.text(`Payment Method: Card ending in ****`, 50, 305)
    doc.text(`Currency: LKR`, 50, 320)
    doc.text(`Type: ${donationData.donationType === "one-time" ? "One-time" : "Monthly"} Donation`, 50, 335)

    // Amount box
    doc.rect(50, 370, 500, 60).stroke()
    doc.fontSize(12).fillColor("#000").text("Donation Amount", 60, 385)
    doc.fontSize(20).fillColor("#f97316").text(`LKR ${donationData.amount.toLocaleString()}`, 60, 405)

    // Message if provided
    if (donationData.donorInfo.message) {
      doc.fontSize(14).fillColor("#000").text("Message", 50, 460)
      doc.fontSize(10).fillColor("#333").text(donationData.donorInfo.message, 50, 480, { width: 500 })
    }

    // Tax information
    doc.fontSize(12).fillColor("#000").text("Tax Information", 50, 550)
    doc.fontSize(10).fillColor("#333")
    doc.text("This donation is tax-deductible. Please keep this receipt for your records.", 50, 570)
    doc.text("Tax ID: 123456789 (Sample)", 50, 585)

    // Footer
    doc.fontSize(8).fillColor("#666")
    doc.text("Thank you for your generous donation to ZenSlot.", 50, 650)
    doc.text("Your contribution helps us provide essential medical assistance across Sri Lanka.", 50, 665)
    doc.text("For questions about this receipt, please contact us at support@divisarana.org", 50, 680)

    // Organization details
    doc.text("ZenSlot | Address: Colombo, Sri Lanka | Phone: +94 77 123 4567", 50, 720)
    doc.text("Website: www.divisarana.org | Email: info@divisarana.org", 50, 735)

    doc.end()

    return new Promise((resolve) => {
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks)
        resolve(
          new NextResponse(pdfBuffer, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="donation-receipt-${paymentIntentId}.pdf"`,
            },
          }),
        )
      })
    })
  } catch (error) {
    console.error("Error generating receipt:", error)
    return NextResponse.json({ error: "Failed to generate receipt" }, { status: 500 })
  }
}
