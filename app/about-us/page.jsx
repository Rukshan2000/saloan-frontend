"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Eye, Award, Users, Heart, Globe } from "lucide-react"
import Link from "next/link"

export default function AboutUsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About ZenSlot</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Dedicated to supporting communities across Sri Lanka through medical assistance, education, and humanitarian
            aid since our founding.
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section id="who-we-are" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <p className="text-gray-600 mb-4">
                ZenSlot is a non-profit organization founded with a simple yet powerful mission: to provide support
                and assistance to those who need it most across Sri Lanka. Our journey began with a small group of
                dedicated individuals who recognized the urgent need for medical assistance in underserved communities.
              </p>
              <p className="text-gray-600 mb-4">
                Over the years, we have expanded our reach and impact, working closely with hospitals, government
                authorities, and local communities to ensure that our assistance reaches those who need it most
                effectively. We believe in transparency, accountability, and community-centered service.
              </p>
              <p className="text-gray-600 mb-6">
                Today, we continue to grow and evolve, always staying true to our core values of compassion,
                transparency, and community-centered service. Our work spans across medical assistance, educational
                support, emergency relief, and community development programs.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Community Focused</h3>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Heart className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Compassionate Care</h3>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg">
              <img
                src="/assets/images/about-who-we-are.jpg"
                alt="Who We Are"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Director Message Section */}
      <section id="director-message" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-200 h-96 rounded-lg">
              <img src="/assets/images/director.jpg" alt="Director" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Message from Our Director</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4 italic">
                  "When we started ZenSlot, our vision was simple: to ensure that no one in Sri Lanka would have to
                  suffer due to lack of access to basic medical care and support. Today, I am proud to see how far we
                  have come in achieving this vision."
                </p>
                <p className="text-gray-600 mb-4">
                  "Our work is made possible by the dedication of our volunteers, the generosity of our donors, and the
                  trust of the communities we serve. Every life we touch, every family we help, and every community we
                  support reinforces our commitment to this noble cause."
                </p>
                <p className="text-gray-600 mb-6">
                  "As we look to the future, we remain committed to expanding our reach, improving our services, and
                  continuing to be a beacon of hope for those in need. Together, we can build a healthier, more
                  compassionate Sri Lanka."
                </p>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900">Dr. Samantha Perera</h4>
                  <p className="text-sm text-gray-500">Founder & Director, ZenSlot</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Foundation</h2>
            <p className="text-xl text-gray-600">The principles that guide our work and define our purpose.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To provide essential medical assistance and humanitarian support to communities across Sri Lanka,
                  working in partnership with healthcare institutions and government authorities to ensure no one is
                  left behind.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <Eye className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  A Sri Lanka where every person has access to quality healthcare and support, regardless of their
                  location, economic circumstances, or social background. A nation where compassion and care reach every
                  corner.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
                <p className="text-gray-600">
                  Compassion, transparency, accountability, and community-centered service guide everything we do. We
                  believe in dignity, respect, and the inherent worth of every individual we serve.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our References & Partners</h2>
            <p className="text-xl text-gray-600">
              We work closely with trusted partners and institutions to maximize our impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Government Partners */}
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ministry of Health</h3>
                <p className="text-sm text-gray-600">Official partnership for healthcare initiatives</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">National Hospital</h3>
                <p className="text-sm text-gray-600">Medical equipment and patient support</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Local NGOs</h3>
                <p className="text-sm text-gray-600">Community outreach and support</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">International Aid</h3>
                <p className="text-sm text-gray-600">Global humanitarian organizations</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              All our assistance is provided based on official recommendations and requests from hospital doctors and
              relevant government hospital authorities in Sri Lanka.
            </p>
            <Link href="/sponsors">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">View All Partners</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join Our Mission</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Whether through donations, volunteering, or spreading awareness, there are many ways you can help us
            continue our vital work in communities across Sri Lanka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4">
                Donate Now
              </Button>
            </Link>
            <Link href="/volunteer">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-orange-500 border-orange-500 hover:bg-orange-50 px-8 py-4"
              >
                Become a Volunteer
              </Button>
            </Link>
            <Link href="/our-team">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-8 py-4"
              >
                Meet Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
