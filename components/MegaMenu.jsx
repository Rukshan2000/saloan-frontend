"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Users, Globe, Award, MapPin, Phone, Mail, ArrowRight, Send, Loader2, Play } from "lucide-react"

const MegaMenu = ({ state }) => {
  const [aboutUsActive, setAboutUsActive] = useState(1)
  const [aboutUsSub, setAboutUsSub] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSubmitSuccess(true)
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Mock data for campaigns
  const mockCampaign = {
    program_title: "Medical Equipment for Rural Hospitals",
    description:
      "Providing essential medical equipment to hospitals in remote areas of Sri Lanka to improve healthcare access for underserved communities.",
    total_donations: 350000,
    target_amount: 500000,
    currency: "lkr",
    program_image: "/placeholder.svg?height=400&width=600",
  }

  // Mock data for events
  const mockEvent = {
    id: 1,
    title: "Medical Camp - Anuradhapura",
    description: "Free medical checkups and consultations for rural communities in the Anuradhapura district.",
    startDate: "2024-02-15 09:00:00",
    endDate: "2024-02-15 16:00:00",
    location: "Anuradhapura General Hospital",
    image2: "/placeholder.svg?height=400&width=600",
    weburl: "",
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    const [date, time] = timestamp.split(" ")
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "p.m." : "a.m."
    const formattedHours = hours % 12 || 12
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  const calculateProgress = (raised, target) => {
    return Math.min((raised / target) * 100, 100)
  }

  return (
    <>
      {state === "Home" && (
        <div className="shadow-xl">
          <div className="dropdown-content w-full flex">
            <div className="xl:w-[1000px] w-[800px] flex bg-white">
              <div className="w-1/3">
                <div className="h-[5px] bg-orange-500"></div>
                <div className="grid items-center pb-3 border-r border-gray-200 h-full">
                  <div className="flex p-4 gap-5 items-center hover:bg-orange-50 transition-colors duration-300">
                    <div className="flex gap-5 items-center">
                      <Globe className="w-10 h-10 text-orange-500" />
                      <div>
                        <p className="text-xl font-semibold text-orange-950">Site Map</p>
                        <p className="text-gray-600">Navigate through our site</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="w-full flex">
                <div className="w-1/3 border-r border-gray-200">
                  <div className="h-[5px] bg-orange-500"></div>
                  <div className="pt-5 grid gap-1">
                    <Link href="/#hero-section">
                      <p className="p-2 text-orange-950 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 cursor-pointer">
                        Main
                      </p>
                    </Link>
                    <Link href="/#donation-section">
                      <p className="p-2 text-orange-950 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 cursor-pointer">
                        Donation
                      </p>
                    </Link>
                    <Link href="/#info-section">
                      <p className="p-2 text-orange-950 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 cursor-pointer">
                        Information
                      </p>
                    </Link>
                    <Link href="/#campaigns">
                      <p className="p-2 text-orange-950 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 cursor-pointer">
                        Campaigns
                      </p>
                    </Link>
                    <Link href="/#mission-section">
                      <p className="p-2 text-orange-950 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 cursor-pointer">
                        Mission
                      </p>
                    </Link>
                    <Link href="/#event-section">
                      <p className="p-2 text-orange-950 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 cursor-pointer">
                        Events
                      </p>
                    </Link>
                    <Link href="/#volunteer-section">
                      <p className="p-2 text-orange-950 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 cursor-pointer">
                        Volunteers
                      </p>
                    </Link>
                    <Link href="/#testimonials-section">
                      <p className="p-2 text-orange-950 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 cursor-pointer">
                        Testimonials
                      </p>
                    </Link>
                    <Link href="/#news-section">
                      <p className="p-2 text-orange-950 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 cursor-pointer">
                        News
                      </p>
                    </Link>
                  </div>
                </div>
                <div className="w-2/3">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Site overview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {state === "About us" && (
        <div className="shadow-xl">
          <div className="dropdown-content w-full flex">
            <div className="xl:w-[1000px] w-[800px] flex bg-white">
              <div className="w-1/3">
                <div className="h-[5px] bg-orange-500"></div>
                <div className="border-r border-gray-200 h-full">
                  <Link href="/about-us">
                    <div
                      onMouseEnter={() => setAboutUsActive(1)}
                      className="flex py-5 cursor-pointer p-2 justify-between items-center ps-4 hover:bg-orange-50 transition-colors duration-300"
                    >
                      <div className="flex gap-5 items-center">
                        <Heart className="w-10 h-10 text-orange-500" />
                        <div>
                          <p className="text-[15px] font-semibold text-orange-950">About us</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>

                  <Link href="/our-team">
                    <div
                      onMouseEnter={() => setAboutUsActive(5)}
                      className="flex py-5 cursor-pointer p-2 justify-between items-center ps-4 hover:bg-orange-50 transition-colors duration-300"
                    >
                      <div className="flex gap-5 items-center">
                        <Users className="w-10 h-10 text-orange-500" />
                        <div>
                          <p className="text-[15px] font-semibold text-orange-950">Our Team</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>

                  <Link href="/services">
                    <div
                      onMouseEnter={() => setAboutUsActive(6)}
                      className="flex py-5 cursor-pointer p-2 justify-between items-center ps-4 hover:bg-orange-50 transition-colors duration-300"
                    >
                      <div className="flex gap-5 items-center">
                        <Award className="w-10 h-10 text-orange-500" />
                        <div>
                          <p className="text-[15px] font-semibold text-orange-950">Our Service</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>

                  <Link href="/sponsors">
                    <div
                      onMouseEnter={() => setAboutUsActive(7)}
                      className="flex py-5 cursor-pointer p-2 justify-between items-center ps-4 hover:bg-orange-50 transition-colors duration-300"
                    >
                      <div className="flex gap-5 items-center">
                        <Globe className="w-10 h-10 text-orange-500" />
                        <div>
                          <p className="text-[15px] font-semibold text-orange-950">Our Sponsors</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>

                  <div
                    onMouseEnter={() => setAboutUsActive(8)}
                    className="flex py-5 cursor-pointer p-2 justify-between items-center ps-4 hover:bg-orange-50 transition-colors duration-300"
                  >
                    <div className="flex gap-5 items-center">
                      <Globe className="w-10 h-10 text-orange-500" />
                      <div>
                        <p className="text-[15px] font-semibold text-orange-950">Overseas partners</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="w-full flex">
                <div
                  className={`${
                    aboutUsActive === 1
                      ? "w-1/3 border-r border-gray-200 flex flex-col gap-4"
                      : aboutUsActive === 5
                        ? "w-1/3"
                        : aboutUsActive === 7 || aboutUsActive === 8
                          ? "w-full"
                          : "w-2/3"
                  }`}
                >
                  <div className="h-[5px] bg-orange-500"></div>

                  {aboutUsActive === 1 && (
                    <>
                      <Link href="/about-us#who-we-are">
                        <div
                          onMouseEnter={() => setAboutUsSub(0)}
                          className="flex cursor-pointer p-2 justify-between items-center ps-4 hover:bg-orange-50 transition-colors duration-300"
                        >
                          <div className="flex gap-5 items-center">
                            <Heart className="w-10 h-10 text-orange-500" />
                            <div>
                              <p className="text-[15px] font-semibold text-orange-950">Who we are</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </Link>

                      <Link href="/about-us#director-message">
                        <div
                          onMouseEnter={() => setAboutUsSub(1)}
                          className="flex p-2 justify-between items-center ps-4 cursor-pointer hover:bg-orange-50 transition-colors duration-300"
                        >
                          <div className="flex gap-5 items-center">
                            <Users className="w-10 h-10 text-orange-500" />
                            <div>
                              <p className="text-[15px] font-semibold text-orange-950">Director message</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </Link>

                      <Link href="/about-us#partners">
                        <div
                          onMouseEnter={() => setAboutUsSub(2)}
                          className="flex cursor-pointer p-2 justify-between items-center ps-4 hover:bg-orange-50 transition-colors duration-300"
                        >
                          <div className="flex gap-5 items-center">
                            <Award className="w-10 h-10 text-orange-500" />
                            <div>
                              <p className="text-[15px] font-semibold text-orange-950">Our reference</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </Link>
                    </>
                  )}

                  {aboutUsActive === 5 && (
                    <div className="grid gap-5 items-center p-5">
                      <Link href="/our-team?c=1">
                        <p className="p-5 cursor-pointer text-orange-950 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 rounded-lg">
                          Team
                        </p>
                      </Link>
                      <Link href="/our-team?c=2">
                        <p className="p-5 cursor-pointer text-orange-950 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 rounded-lg">
                          Advisors
                        </p>
                      </Link>
                      <Link href="/our-team?c=3">
                        <p className="p-5 cursor-pointer text-orange-950 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 rounded-lg">
                          Board
                        </p>
                      </Link>
                      <Link href="/our-team?c=4">
                        <p className="p-5 cursor-pointer text-orange-950 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 rounded-lg">
                          Sponsors
                        </p>
                      </Link>
                    </div>
                  )}

                  {aboutUsActive === 6 && (
                    <div className="p-5">
                      <p className="font-semibold text-[20px] text-orange-950 mb-4">Services</p>
                      <div className="grid gap-3 text-gray-700">
                        <p className="hover:text-orange-950 transition-colors duration-300">
                          Medical Equipment Donations
                        </p>
                        <p className="hover:text-orange-950 transition-colors duration-300">
                          Hospital Renovation Support
                        </p>
                        <p className="hover:text-orange-950 transition-colors duration-300">Free Health Camps</p>
                        <p className="hover:text-orange-950 transition-colors duration-300">
                          Patient Transportation Services
                        </p>
                        <p className="hover:text-orange-950 transition-colors duration-300">Emergency Care Support</p>
                        <p className="hover:text-orange-950 transition-colors duration-300">Pharmaceutical Aid</p>
                        <p className="hover:text-orange-950 transition-colors duration-300">
                          Nutritional Support for Patients
                        </p>
                        <p className="hover:text-orange-950 transition-colors duration-300">Blood Donation Drives</p>
                      </div>
                    </div>
                  )}

                  {aboutUsActive === 7 && (
                    <div>
                      <p className="text-[25px] font-semibold flex justify-center pt-5 text-orange-950">Sponsors</p>
                      <div className="p-10 grid gap-5 grid-cols-3">
                        {[...Array(6)].map((_, index) => (
                          <div key={index} className="hover:scale-105 transition-transform duration-300">
                            <img
                              src="/placeholder.svg?height=150&width=150"
                              alt="Sponsor"
                              className="w-[150px] h-[100px] object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {aboutUsActive === 8 && (
                    <>
                      <p className="font-bold text-[25px] mt-5 flex justify-center text-orange-950">Partners</p>
                      <div className="px-5 grid gap-10 mt-10 grid-cols-2">
                        <Link href="/partners/uk">
                          <div className="flex gap-5 items-center hover:bg-orange-50 p-3 rounded-lg transition-colors duration-300 cursor-pointer">
                            <p className="text-orange-950 font-medium">United Kingdom</p>
                            <div className="w-[50px] h-[50px] bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">UK</span>
                            </div>
                          </div>
                        </Link>
                        <Link href="/partners/us">
                          <div className="flex gap-5 items-center hover:bg-orange-50 p-3 rounded-lg transition-colors duration-300 cursor-pointer">
                            <p className="text-orange-950 font-medium">United States</p>
                            <div className="w-[50px] h-[50px] bg-red-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">US</span>
                            </div>
                          </div>
                        </Link>
                        <Link href="/partners/canada">
                          <div className="flex gap-5 items-center hover:bg-orange-50 p-3 rounded-lg transition-colors duration-300 cursor-pointer">
                            <p className="text-orange-950 font-medium">Canada</p>
                            <div className="w-[50px] h-[50px] bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">CA</span>
                            </div>
                          </div>
                        </Link>
                        <Link href="/partners/australia">
                          <div className="flex gap-5 items-center hover:bg-orange-50 p-3 rounded-lg transition-colors duration-300 cursor-pointer">
                            <p className="text-orange-950 font-medium">Australia</p>
                            <div className="w-[50px] h-[50px] bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">AU</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {aboutUsActive !== 7 && aboutUsActive !== 8 && (
                  <div className={`${aboutUsActive === 1 ? "w-2/3" : aboutUsActive === 5 ? "w-2/3" : "w-1/3"}`}>
                    <img
                      src="/placeholder.svg?height=400&width=600"
                      alt="About section"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {state === "Contact us" && (
        <div className="shadow-xl">
          <div className="dropdown-content flex justify-end">
            <div className="xl:w-[1000px] w-[800px] shadow-xl flex bg-white">
              <div className="bg-gray-100 w-1/2">
                <div className="bg-orange-500 h-[5px]"></div>
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Our Office</h3>
                    <p className="text-gray-600 mb-4">123 Main Street, Colombo 07, Sri Lanka</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>+94 11 234 5678</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>info@divisarana.org</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <div className="bg-orange-500 h-[5px]"></div>
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                      <div className="w-1/2">
                        <Input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Name"
                          required
                        />
                      </div>
                      <div className="w-1/2">
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Email Address"
                          required
                        />
                      </div>
                    </div>
                    <Input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      placeholder="Phone number"
                    />
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Subject"
                      required
                    />
                    <Textarea
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Message"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className={`${
                        submitSuccess ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"
                      } text-white flex items-center gap-2`}
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {submitSuccess ? "Message Sent!" : isSubmitting ? "Sending..." : "Send"}
                      {!isSubmitting && <Send className="w-4 h-4" />}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {state === "Campaigns" && (
        <div className="shadow-xl">
          <div className="dropdown-content bg-white flex justify-end">
            <div className="xl:w-[1000px] w-[800px] flex">
              <div className="w-1/2">
                <div className="h-[5px] bg-orange-500 w-full"></div>
                <p className="text-[20px] font-semibold flex justify-center pt-5 text-orange-950">Campaign</p>
                <div className="ps-5 pe-5 mt-5">
                  <div className="flex font-bold text-[25px] justify-center text-center text-orange-950 mb-4">
                    {mockCampaign.program_title}
                  </div>
                  <div className="font-light text-gray-700 leading-relaxed mb-4">{mockCampaign.description}</div>
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="font-semibold text-orange-950">Raised</p>
                      <div className="text-orange-600 font-bold">
                        <p>
                          {mockCampaign.currency.toUpperCase()} {mockCampaign.total_donations.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-950">Goal</p>
                      <div className="text-orange-600 font-bold">
                        <p>
                          {mockCampaign.currency.toUpperCase()} {mockCampaign.target_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="w-full bg-gray-200 rounded-full h-10 mb-4">
                      <div
                        className="bg-orange-500 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{
                          width: `${calculateProgress(mockCampaign.total_donations, mockCampaign.target_amount)}%`,
                        }}
                      >
                        {Math.round(calculateProgress(mockCampaign.total_donations, mockCampaign.target_amount))}%
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Link href="/donate">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 font-bold">
                          DONATE NOW
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative w-1/2">
                <img
                  src={mockCampaign.program_image || "/placeholder.svg"}
                  className="h-[400px] w-full object-cover"
                  alt="Campaign"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {state === "Events" && (
        <div className="shadow-xl">
          <div className="dropdown-content bg-white h-[400px] flex justify-end">
            <div className="xl:w-[1000px] w-[800px] flex">
              <div className="w-1/2">
                <div className="h-[5px] bg-orange-500 w-full"></div>
                <p className="text-[20px] font-semibold flex justify-center pt-5 text-orange-950">Event</p>
                <div className="ps-5 pe-5 mt-5">
                  <p className="flex font-bold text-[25px] justify-center text-center text-orange-950 mb-4">
                    {mockEvent.title}
                  </p>
                  <p className="font-light text-gray-700 leading-relaxed mb-4">{mockEvent.description}</p>
                  <div className="flex mt-4 justify-between">
                    <div>
                      <p className="font-semibold text-orange-950">Date/Time</p>
                      <p className="text-gray-700">{mockEvent.startDate.split(" ")[0]}</p>
                      <p className="text-gray-700">
                        {formatTime(mockEvent.startDate)} - {formatTime(mockEvent.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="flex justify-end font-semibold text-orange-950">Venue</p>
                      <p className="text-gray-700">{mockEvent.location}</p>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Link href={`/events`}>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3">View Event</Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <img
                  src={mockEvent.image2 || "/placeholder.svg"}
                  alt="Event"
                  className="h-[400px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {state === "Gallery" && (
        <div className="shadow-xl">
          <div className="dropdown-content bg-white flex justify-end">
            <div className="xl:w-[1000px] w-[800px] flex">
              <div className="w-1/2">
                <div className="h-[5px] bg-orange-500 w-full"></div>
                <p className="text-[20px] font-semibold flex justify-center mt-2 pb-3 text-orange-950">
                  Gallery Preview
                </p>
                <div className="w-full ps-5 pe-5 pb-5 max-h-[400px] overflow-y-auto">
                  <div className="space-y-4">
                    <div className="bg-orange-950 p-3 w-[100px] flex justify-center items-center rounded-full text-white font-semibold">
                      2024
                    </div>
                    <div className="ms-12 border-l-2 border-dashed border-orange-950 pl-4 space-y-3">
                      <div className="p-3 hover:bg-orange-50 rounded-lg transition-colors duration-300 cursor-pointer">
                        <span className="text-[13px] text-orange-600 font-medium">Jan 15</span>
                        <br />
                        <span className="text-gray-700">Medical Camp - Anuradhapura</span>
                      </div>
                      <div className="p-3 hover:bg-orange-50 rounded-lg transition-colors duration-300 cursor-pointer">
                        <span className="text-[13px] text-orange-600 font-medium">Feb 20</span>
                        <br />
                        <span className="text-gray-700">Volunteer Training Workshop</span>
                      </div>
                      <div className="p-3 hover:bg-orange-50 rounded-lg transition-colors duration-300 cursor-pointer">
                        <span className="text-[13px] text-orange-600 font-medium">Mar 10</span>
                        <br />
                        <span className="text-gray-700">Community Health Program</span>
                      </div>
                    </div>
                    <Link href="/gallery">
                      <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                        View More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="w-1/2 relative h-[400px]">
                <img src="/placeholder.svg?height=400&width=600" alt="Gallery" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}

      {state === "Volunteer" && (
        <div className="shadow-xl">
          <div className="dropdown-content bg-white flex justify-end">
            <div className="xl:w-[1000px] w-[800px] flex">
              <div className="w-1/2 bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Volunteer Impact Video</p>
                  <p className="text-sm text-gray-300 mt-2">See how volunteers make a difference</p>
                </div>
              </div>
              <div className="w-1/2">
                <div className="h-[5px] bg-orange-500 w-full"></div>
                <p className="flex justify-center text-[25px] mt-5 font-semibold text-orange-950">
                  Importance of Volunteering
                </p>
                <p className="p-5 text-[15px] font-light text-gray-700 leading-relaxed">
                  Volunteering in charity projects is a powerful way to make a positive impact on society while
                  enriching your own life. It allows individuals to contribute their time, skills, and compassion to
                  support meaningful causes, from providing aid to those in need to improving community resources. By
                  becoming a volunteer, you not only help drive change but also gain valuable experiences, build
                  connections, and foster a deeper sense of purpose and fulfillment.
                </p>
                <div className="flex justify-center">
                  <Link href="/volunteer">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">Be a Volunteer</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MegaMenu
