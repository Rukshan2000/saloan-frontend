"use client"

import { useState } from "react"
import { useSubmitVolunteerMutation } from "../../redux/features/content_slice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Users, Globe, Award } from "lucide-react"

export default function VolunteerPage() {
  const [submitVolunteer, { isLoading, isSuccess, error }] = useSubmitVolunteerMutation()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    location: "",
    skills: "",
    availability: "",
    motivation: "",
    interests: [],
  })

  const volunteerAreas = [
    "Medical Assistance",
    "Education Support",
    "Community Development",
    "Event Organization",
    "Fundraising",
    "Social Media & Marketing",
    "Administrative Support",
    "Translation Services",
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await submitVolunteer(formData).unwrap()
      setFormData({
        name: "",
        email: "",
        phone: "",
        age: "",
        location: "",
        skills: "",
        availability: "",
        motivation: "",
        interests: [],
      })
    } catch (err) {
      console.error("Failed to submit volunteer form:", err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleInterestChange = (interest, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest],
      })
    } else {
      setFormData({
        ...formData,
        interests: formData.interests.filter((i) => i !== interest),
      })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Become a Volunteer</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Join our community of dedicated volunteers and help us make a positive impact across Sri Lanka.
          </p>
        </div>
      </section>

      {/* Why Volunteer Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Volunteer With Us?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Volunteering with ZenSlot offers you the opportunity to make a real difference while gaining valuable
              experience and building meaningful connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Make a Difference</h3>
              <p className="text-gray-600">Directly impact the lives of people in need across Sri Lanka.</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Community</h3>
              <p className="text-gray-600">
                Connect with like-minded individuals who share your passion for helping others.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gain Experience</h3>
              <p className="text-gray-600">Develop new skills and gain valuable experience in humanitarian work.</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Growth</h3>
              <p className="text-gray-600">Experience personal fulfillment through meaningful service to others.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Application Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 text-center">Volunteer Application Form</CardTitle>
            </CardHeader>
            <CardContent>
              {isSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
                  Thank you for your interest in volunteering! We'll review your application and get back to you soon.
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
                  There was an error submitting your application. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                        Age *
                      </label>
                      <Input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min="16"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location (City/District) *
                    </label>
                    <Input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Volunteer Interests */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas of Interest</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {volunteerAreas.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={formData.interests.includes(area)}
                          onCheckedChange={(checked) => handleInterestChange(area, checked)}
                        />
                        <label htmlFor={area} className="text-sm text-gray-700">
                          {area}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills and Experience */}
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                    Skills and Experience
                  </label>
                  <Textarea
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your relevant skills, experience, or qualifications..."
                  />
                </div>

                {/* Availability */}
                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                    Availability *
                  </label>
                  <Textarea
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Please describe your availability (days, times, frequency)..."
                  />
                </div>

                {/* Motivation */}
                <div>
                  <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to volunteer with us? *
                  </label>
                  <Textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Tell us about your motivation to volunteer and what you hope to achieve..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isLoading ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
