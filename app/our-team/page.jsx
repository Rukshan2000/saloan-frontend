"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Linkedin, Twitter } from "lucide-react"

export default function OurTeamPage() {
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState("1")

  useEffect(() => {
    const category = searchParams.get("c")
    if (category) {
      setActiveCategory(category)
    }
  }, [searchParams])

  const categories = [
    { id: "1", name: "Team", description: "Our core team members" },
    { id: "2", name: "Advisors", description: "Expert advisors guiding our mission" },
    { id: "3", name: "Board", description: "Board of directors" },
    { id: "4", name: "Sponsors", description: "Our generous sponsors" },
  ]

  const teamMembers = {
    1: [
      {
        id: 1,
        name: "Dr. Samantha Perera",
        position: "Founder & Director",
        image: "/assets/images/team/director.jpg",
        bio: "Leading our organization with over 15 years of experience in healthcare and humanitarian work.",
        email: "samantha@divisarana.org",
        phone: "+94 77 123 4567",
        linkedin: "#",
      },
      {
        id: 2,
        name: "Nimal Fernando",
        position: "Operations Manager",
        image: "/assets/images/team/operations.jpg",
        bio: "Ensuring smooth operations and coordination of all our programs and initiatives.",
        email: "nimal@divisarana.org",
        phone: "+94 77 234 5678",
        linkedin: "#",
      },
      {
        id: 3,
        name: "Priya Jayawardena",
        position: "Program Coordinator",
        image: "/assets/images/team/coordinator.jpg",
        bio: "Coordinating our medical assistance programs and community outreach initiatives.",
        email: "priya@divisarana.org",
        phone: "+94 77 345 6789",
        linkedin: "#",
      },
    ],
    2: [
      {
        id: 4,
        name: "Prof. Ranjith Silva",
        position: "Medical Advisor",
        image: "/assets/images/team/advisor1.jpg",
        bio: "Providing medical expertise and guidance for our healthcare initiatives.",
        email: "ranjith.advisor@divisarana.org",
        linkedin: "#",
      },
      {
        id: 5,
        name: "Dr. Kamala Wijesinghe",
        position: "Healthcare Policy Advisor",
        image: "/assets/images/team/advisor2.jpg",
        bio: "Advising on healthcare policy and strategic partnerships with government institutions.",
        email: "kamala.advisor@divisarana.org",
        linkedin: "#",
      },
    ],
    3: [
      {
        id: 6,
        name: "Mr. Sunil Ratnatunga",
        position: "Chairman",
        image: "/assets/images/team/chairman.jpg",
        bio: "Leading the board with extensive experience in non-profit governance and community development.",
        email: "chairman@divisarana.org",
        linkedin: "#",
      },
      {
        id: 7,
        name: "Mrs. Malini Gunasekara",
        position: "Board Member",
        image: "/assets/images/team/board1.jpg",
        bio: "Bringing expertise in finance and organizational management to our board.",
        email: "malini.board@divisarana.org",
        linkedin: "#",
      },
    ],
    4: [
      {
        id: 8,
        name: "ABC Corporation",
        position: "Platinum Sponsor",
        image: "/assets/images/sponsors/abc-corp.jpg",
        bio: "Supporting our medical equipment donation programs with generous contributions.",
        website: "https://abccorp.lk",
      },
      {
        id: 9,
        name: "XYZ Foundation",
        position: "Gold Sponsor",
        image: "/assets/images/sponsors/xyz-foundation.jpg",
        bio: "Partnering with us to provide educational support and community development programs.",
        website: "https://xyzfoundation.org",
      },
    ],
  }

  const currentMembers = teamMembers[activeCategory] || []

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Meet the dedicated individuals who make our mission possible through their expertise, passion, and
            commitment to serving communities across Sri Lanka.
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={
                  activeCategory === category.id
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-600">{categories.find((cat) => cat.id === activeCategory)?.description}</p>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-64 bg-gray-200">
                  <img
                    src={member.image || "/placeholder.svg?height=300&width=300"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-orange-500 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>

                  {/* Contact Information */}
                  <div className="space-y-2">
                    {member.email && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        <a href={`mailto:${member.email}`} className="hover:text-orange-500">
                          {member.email}
                        </a>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-2" />
                        <a href={`tel:${member.phone}`} className="hover:text-orange-500">
                          {member.phone}
                        </a>
                      </div>
                    )}
                    {member.website && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Linkedin className="h-4 w-4 mr-2" />
                        <a
                          href={member.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-orange-500"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {(member.linkedin || member.twitter) && (
                    <div className="flex space-x-3 mt-4 pt-4 border-t">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-orange-500"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-orange-500"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {currentMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No members found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join Our Team</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're always looking for passionate individuals who want to make a difference. Whether as a volunteer, team
            member, or partner, there's a place for you in our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4">View Open Positions</Button>
            <Button
              variant="outline"
              className="bg-white text-orange-500 border-orange-500 hover:bg-orange-50 px-8 py-4"
            >
              Become a Volunteer
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
