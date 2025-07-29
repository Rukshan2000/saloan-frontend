"use client"

import { useGetAllEventsQuery } from "../../redux/features/events/events_slice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Users } from "lucide-react"

export default function EventsPage() {
  const { data: events, error, isLoading } = useGetAllEventsQuery()
  console.log("Fetched events:", events)

  // Use only fetched events, handle API structure
  const displayEvents = events?.data || []
  const today = new Date("2025-06-25")

  // Helper to parse date string to Date object
  const parseDate = (dateStr) => {
    if (!dateStr) return null
    // Handles "YYYY-MM-DD HH:mm:ss"
    const [datePart] = dateStr.split(" ")
    return new Date(datePart)
  }

  // Upcoming: status active, endDate >= today
  const upcomingEvents = displayEvents.filter(
    (event) => event.status === "active" && parseDate(event.endDate) && parseDate(event.endDate) >= today && !event.deleted_at
  )
  // Past: status active, endDate < today
  const pastEvents = displayEvents.filter(
    (event) => event.status === "active" && parseDate(event.endDate) && parseDate(event.endDate) < today && !event.deleted_at
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading events</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  // Helper for event image
  const getEventImage = (event) => event.image1 || event.image2 || "/placeholder.svg"
  // Helper for event location (could be a number, fallback to 'TBA')
  const getEventLocation = (event) => event.location || "Location TBA"
  // Helper for event date
  const getEventDate = (event) => {
    const d = parseDate(event.startDate)
    return d ? d.toLocaleDateString() : "Date TBA"
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Events</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Join us at our upcoming events and see how we're making a difference in communities across Sri Lanka.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600">
              Don't miss out on our upcoming events and opportunities to get involved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No upcoming events found.</div>
            ) : (
              upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200">
                    <img
                      src={getEventImage(event)}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {getEventDate(event)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {getEventLocation(event)}
                      </div>
                    </div>

                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Register Now</Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Past Events</h2>
            <p className="text-xl text-gray-600">
              Take a look at some of our recent successful events and their impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No past events found.</div>
            ) : (
              pastEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={getEventImage(event)}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Completed
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {getEventDate(event)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {getEventLocation(event)}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full bg-white text-gray-700 border-gray-300">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Don't miss out on our upcoming events. Subscribe to our newsletter or follow us on social media to stay
            informed about all our activities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4">
              Subscribe to Newsletter
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-gray-700 border-gray-300 px-8 py-4">
              Follow Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
