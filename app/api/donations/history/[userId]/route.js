import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    const { userId } = params

    // Here you would typically fetch from your database
    // For now, we'll return mock data
    const donations = [
      {
        id: "don_1234567890",
        amount: 5000,
        currency: "LKR",
        type: "one-time",
        status: "completed",
        createdAt: "2024-01-15T10:30:00Z",
        campaign: "Medical Equipment for Rural Hospitals",
      },
      {
        id: "don_0987654321",
        amount: 2500,
        currency: "LKR",
        type: "monthly",
        status: "completed",
        createdAt: "2024-01-01T09:15:00Z",
        campaign: "General Fund",
      },
    ]

    return NextResponse.json({
      success: true,
      donations: donations,
    })
  } catch (error) {
    console.error("Error fetching donation history:", error)
    return NextResponse.json({ error: "Failed to fetch donation history" }, { status: 500 })
  }
}
