"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About ZenSlot</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Dedicated to supporting communities across Sri Lanka through medical assistance, education, and humanitarian
            aid.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                ZenSlot was founded with a simple yet powerful mission: to provide support and assistance to those
                who need it most across Sri Lanka. Our journey began with a small group of dedicated individuals who
                recognized the urgent need for medical assistance in underserved communities.
              </p>
              <p className="text-gray-600 mb-4">
                Over the years, we have expanded our reach and impact, working closely with hospitals, government
                authorities, and local communities to ensure that our assistance reaches those who need it most
                effectively.
              </p>
              <p className="text-gray-600">
                Today, we continue to grow and evolve, always staying true to our core values of compassion,
                transparency, and community-centered service.
              </p>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Our Story"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To provide essential medical assistance and humanitarian support to communities across Sri Lanka,
                  working in partnership with healthcare institutions and government authorities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <Eye className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  A Sri Lanka where every person has access to quality healthcare and support, regardless of their
                  location or economic circumstances.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
                <p className="text-gray-600">
                  Compassion, transparency, accountability, and community-centered service guide everything we do in our
                  mission to help others.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated individuals who make our mission possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((member) => (
              <Card key={member} className="text-center overflow-hidden">
                <div className="h-64 bg-gray-200">
                  <img
                    src={`/placeholder.svg?height=300&width=300`}
                    alt={`Team Member ${member}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Member {member}</h3>
                  <p className="text-orange-500 font-medium mb-3">Position Title</p>
                  <p className="text-gray-600 text-sm">
                    Brief description of the team member's role and contribution to the organization.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
