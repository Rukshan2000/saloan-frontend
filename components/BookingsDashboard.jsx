import React from 'react'
import { Calendar, Clock, TrendingUp, CheckCircle } from 'lucide-react'

const BookingsDashboard = ({ bookings = [] }) => {
  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length
  const scheduledBookings = bookings.filter(b => b.status === 'SCHEDULED').length
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length
  
  const upcomingBookings = bookings.filter(b => {
    const bookingDate = new Date(b.date)
    const today = new Date()
    return bookingDate >= today && ['SCHEDULED', 'CONFIRMED'].includes(b.status)
  }).length

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Upcoming',
      value: upcomingBookings,
      icon: Clock,
      color: 'bg-orange-100 text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Confirmed',
      value: confirmedBookings,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Completed',
      value: completedBookings,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} border border-gray-200 rounded-lg p-4`}>
          <div className="flex items-center">
            <div className={`${stat.color} rounded-full p-2 mr-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BookingsDashboard
