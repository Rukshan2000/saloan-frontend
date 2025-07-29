"use client"


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Scissors, Users, Clock, Star, Calendar, MapPin, Quote } from "lucide-react"
import { useState } from "react"
import { useGetServicesQuery } from "../redux/features/servicesApi"

export default function HomePage() {
  // Fetch services from Redux API
  const { data: servicesData, error: servicesError, isLoading: servicesLoading } = useGetServicesQuery()
  // Backend connection check state
  const [pingResult, setPingResult] = useState(null)
  const [pingLoading, setPingLoading] = useState(false)
  const [pingError, setPingError] = useState(null)

  async function checkBackend() {
    setPingLoading(true)
    setPingError(null)
    setPingResult(null)
    try {
      const res = await fetch("/api/ping")
      if (!res.ok) throw new Error("Network response was not ok")
      const data = await res.json()
      setPingResult(data.status)
    } catch (err) {
      setPingError("Backend not reachable")
    } finally {
      setPingLoading(false)
    }
  }

  // Sample upcoming appointments data
  const upcomingAppointments = [
    {
      id: 1,
      service: "Premium Hair Cut & Styling",
      date: "2024-07-30",
      time: "10:00 AM",
      salon: "Zen Salon Colombo",
      price: "LKR 2,500"
    },
    {
      id: 2,
      service: "Full Body Massage",
      date: "2024-08-02",
      time: "2:00 PM", 
      salon: "Zen Spa Kandy",
      price: "LKR 4,000"
    },
    {
      id: 3,
      service: "Facial Treatment",
      date: "2024-08-05",
      time: "11:30 AM",
      salon: "Zen Beauty Galle",
      price: "LKR 3,200"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="hero-section" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1500&q=80)",
              filter: "sepia(20%) saturate(80%) brightness(70%)",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>

          {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">Zen Slot</h1>
          <p className="text-xl sm:text-2xl md:text-3xl mb-8 font-light">
            Your perfect salon experience is just a click away
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#booking-section">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full"
              >
                Book Now
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-orange-500 px-8 py-4 text-lg font-semibold rounded-full"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Backend Connection Check */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={checkBackend}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none"
            disabled={pingLoading}
          >
            {pingLoading ? "Checking..." : "Check Backend"}
          </button>
          {pingResult && (
            <div className="mt-2 text-green-500">Backend status: {pingResult}</div>
          )}
          {pingError && (
            <div className="mt-2 text-red-500">{pingError}</div>
          )}
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="bg-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Book Your Perfect Salon Experience</h2>
              <p className="text-lg leading-relaxed mb-6">
                Discover and book appointments at the finest salons and spas across Sri Lanka. From haircuts to full spa treatments, find your perfect relaxation and beauty experience with our easy-to-use booking system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book-appointment">
                  <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 px-6 py-3">
                    Book Appointment
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-orange-500 px-6 py-3"
                  >
                    View Services
                  </Button>
                </Link>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <Link href="/register">
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-orange-500 px-6 py-3"
                >
                  SIGN UP <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Zen Slot</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust Zen Slot for their beauty and wellness needs across Sri Lanka.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scissors className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">150+</h3>
              <p className="text-gray-600">Partner Salons</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">25+</h3>
              <p className="text-gray-600">Cities Covered</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">4.8</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section id="services" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular beauty and wellness services available at partner salons across Sri Lanka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicesLoading && (
              <div className="col-span-3 text-center text-gray-500">Loading services...</div>
            )}
            {servicesError && (
              <div className="col-span-3 text-center text-red-500">Failed to load services.</div>
            )}
            {servicesData && Array.isArray(servicesData) && servicesData.length > 0 ? (
              servicesData.map((service, index) => (
                <Card key={service.id || index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200">
                    <img
                      src={service.image || "/assets/images/placeholder.jpg"}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration || "N/A"}
                        </span>
                        <span className="font-semibold text-orange-500">{service.price ? `LKR ${service.price}` : "Price on request"}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Book Now</Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              !servicesLoading && !servicesError && (
                <div className="col-span-3 text-center text-gray-500">No services found.</div>
              )
            )}
          </div>

          <div className="text-center mt-8">
            <Link href="/services">
              <Button variant="outline" className="bg-white text-orange-500 border-orange-500 hover:bg-orange-50">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Zen Slot</h2>
              <p className="text-gray-600 mb-4">
                Zen Slot is Sri Lanka's premier salon booking platform, connecting customers with the finest beauty and wellness establishments across the island. We make it easy to discover, compare, and book appointments at your preferred salons and spas.
              </p>
              <p className="text-gray-600 mb-6">
                Our platform features verified salons, real-time availability, secure payments, and customer reviews to ensure you have the best possible experience every time you book with us.
              </p>
              <Link href="/about">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Learn More About Us</Button>
              </Link>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg">
              <img
                src="/assets/images/about-zenslot.jpg"
                alt="About Zen Slot"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Appointments Section */}
      <section id="appointments-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
            <p className="text-xl text-gray-600">
              See what services our customers are booking most frequently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{appointment.service}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {appointment.salon}
                    </div>
                    <div className="text-lg font-semibold text-orange-500">
                      {appointment.price}
                    </div>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Book Similar</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/login">
              <Button variant="outline" className="bg-white text-orange-500 border-orange-500 hover:bg-orange-50">
                Login to View Your Bookings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Zen Slot Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Booking your perfect salon experience is simple and convenient with our easy 4-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-200 h-96 rounded-lg">
              <img
                src="/assets/images/how-it-works.jpg"
                alt="How It Works"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Simple Booking Process</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Browse & Select</h4>
                    <p className="text-gray-600">Choose from hundreds of verified salons and services</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pick Date & Time</h4>
                    <p className="text-gray-600">Select your preferred appointment slot from available times</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                    <p className="text-gray-600">Pay securely online or choose to pay at the salon</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Enjoy & Relax</h4>
                    <p className="text-gray-600">Arrive at your appointment and enjoy your service</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/how-it-works">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Hear from satisfied customers who love using Zen Slot.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Fernando",
                role: "Regular Customer",
                review: "Zen Slot makes booking so convenient! I can easily find and book appointments at my favorite salons without any hassle. The app is user-friendly and the service is excellent."
              },
              {
                name: "Rajesh Silva", 
                role: "Business Professional",
                review: "As someone with a busy schedule, Zen Slot is a lifesaver. I can book appointments on the go and even get reminders. The quality of partner salons is consistently high."
              },
              {
                name: "Malini Perera",
                role: "Beauty Enthusiast", 
                review: "I love discovering new salons through Zen Slot. The reviews and ratings help me choose the perfect place, and I've never been disappointed with any of my bookings."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-orange-500 mb-4" />
                  <p className="text-gray-600 mb-4">"{testimonial.review}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                      <img
                        src={`/assets/images/customer-${index + 1}.jpg`}
                        alt={testimonial.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Salons Section */}
      <section id="featured-salons-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Salons</h2>
            <p className="text-xl text-gray-600">Discover some of our top-rated partner salons across Sri Lanka.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Zen Salon Colombo",
                location: "Colombo 7",
                rating: "4.9",
                services: "Hair, Nails, Facial",
                image: "/assets/images/salon-1.jpg"
              },
              {
                name: "Serenity Spa Kandy",
                location: "Kandy Central",
                rating: "4.8", 
                services: "Spa, Massage, Wellness",
                image: "/assets/images/salon-2.jpg"
              },
              {
                name: "Elegance Beauty Galle",
                location: "Galle Fort",
                rating: "4.7",
                services: "Beauty, Bridal, Makeup",
                image: "/assets/images/salon-3.jpg"
              }
            ].map((salon, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200">
                  <img
                    src={salon.image}
                    alt={salon.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{salon.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{salon.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2 text-sm flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {salon.location}
                  </p>
                  <p className="text-gray-600 mb-4 text-sm">{salon.services}</p>
                  <Link href="/salons/1" className="text-orange-500 hover:text-orange-600 font-medium">
                    View Details →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/salons">
              <Button variant="outline" className="bg-white text-orange-500 border-orange-500 hover:bg-orange-50">
                View All Salons
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book Your Next Appointment?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers and discover the convenience of booking salon appointments with Zen Slot. Your perfect beauty experience awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}