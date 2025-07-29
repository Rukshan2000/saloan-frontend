"use client"

import { useFetchCampaignsQuery } from "../../redux/features/content_slice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Target } from "lucide-react"
import Link from "next/link"

export default function CampaignsPage() {
  const { data: campaigns, error, isLoading } = useFetchCampaignsQuery()

  // Mock data for demonstration
  const mockCampaigns = [
    {
      id: 1,
      title: "Medical Equipment for Rural Hospitals",
      description: "Providing essential medical equipment to hospitals in remote areas of Sri Lanka.",
      target: 500000,
      raised: 350000,
      location: "Anuradhapura District",
      endDate: "2024-03-15",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 2,
      title: "Emergency Relief for Flood Victims",
      description: "Immediate assistance for families affected by recent flooding in the region.",
      target: 200000,
      raised: 180000,
      location: "Ratnapura District",
      endDate: "2024-02-28",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 3,
      title: "School Infrastructure Development",
      description: "Building and renovating school facilities in underserved communities.",
      target: 750000,
      raised: 425000,
      location: "Badulla District",
      endDate: "2024-04-30",
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  const displayCampaigns = campaigns || mockCampaigns

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading campaigns</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Campaigns</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Join us in making a difference through our ongoing campaigns and initiatives across Sri Lanka.
          </p>
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Active Campaigns</h2>
            <p className="text-xl text-gray-600">Support our current initiatives and help us reach our goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200">
                  <img
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{campaign.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{campaign.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {campaign.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Ends: {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Target className="h-4 w-4 mr-2" />
                      Goal: LKR {campaign.target.toLocaleString()}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Raised: LKR {campaign.raised.toLocaleString()}</span>
                      <span>{Math.round((campaign.raised / campaign.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${Math.min((campaign.raised / campaign.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Donate Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Start Your Own Campaign</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Have an idea for a campaign that could help communities in Sri Lanka? We'd love to hear from you and help
            make it happen.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
