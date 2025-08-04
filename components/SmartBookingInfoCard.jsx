import React, { useState } from 'react'
import { Sparkles, X, Clock, User, Calendar, CheckCircle, Info } from 'lucide-react'

const SmartBookingInfoCard = ({ onClose = () => {} }) => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    onClose()
  }

  const features = [
    {
      icon: Clock,
      title: "Optimal Time Finding",
      description: "Automatically finds the best available time slots based on your service requirements"
    },
    {
      icon: User,
      title: "Expert Matching",
      description: "Matches you with beauticians who can perform all your selected services"
    },
    {
      icon: Calendar,
      title: "Conflict Prevention",
      description: "Advanced scheduling prevents double-booking and ensures seamless appointments"
    },
    {
      icon: CheckCircle,
      title: "Instant Confirmation",
      description: "Get immediate booking confirmation with all details optimized for you"
    }
  ]

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Smart Booking Now Available!</h3>
            <p className="text-blue-700 text-sm">Experience our AI-powered booking system for optimal appointments</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-blue-400 hover:text-blue-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <feature.icon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 text-sm">{feature.title}</h4>
              <p className="text-blue-700 text-xs mt-1">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white bg-opacity-50 rounded-lg p-3 border border-blue-200">
        <div className="flex items-center text-blue-800 text-sm">
          <Info className="w-4 h-4 mr-2" />
          <span className="font-medium">Pro Tip:</span>
          <span className="ml-1">Choose "Smart Booking" when creating a new appointment for the best experience!</span>
        </div>
      </div>
    </div>
  )
}

export default SmartBookingInfoCard
