import React from 'react'
import { Calendar, Clock, TrendingUp, Users, MapPin, Star } from 'lucide-react'

const BookingInsights = ({ 
  totalServices = 0,
  totalDuration = 0,
  estimatedPrice = 0,
  selectedServices = [],
  availableBeauticians = 0,
  bestTimeSlot = null,
  branchInfo = null
}) => {
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const formatPrice = (price) => {
    if (!price) return 'N/A'
    return typeof price === 'number' ? `$${price.toFixed(2)}` : price
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <TrendingUp className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Booking Summary</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalServices}</div>
          <div className="text-sm text-gray-600">Services</div>
        </div>
        
        <div className="text-center">
          <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatDuration(totalDuration)}</div>
          <div className="text-sm text-gray-600">Duration</div>
        </div>
        
        <div className="text-center">
          <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatPrice(estimatedPrice)}</div>
          <div className="text-sm text-gray-600">Est. Price</div>
        </div>
        
        <div className="text-center">
          <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{availableBeauticians}</div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
      </div>
      
      {selectedServices.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Selected Services</h4>
          <div className="space-y-2">
            {selectedServices.map((service, index) => (
              <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{service.name}</div>
                  <div className="text-sm text-gray-600">{service.duration} minutes</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{formatPrice(service.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {bestTimeSlot && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          <h4 className="font-medium text-gray-900 mb-3">Recommended Time</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  {bestTimeSlot.start_time} - {bestTimeSlot.end_time}
                </span>
              </div>
              <div className="text-sm text-blue-600">Optimal slot</div>
            </div>
          </div>
        </div>
      )}
      
      {branchInfo && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          <h4 className="font-medium text-gray-900 mb-3">Branch Information</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-gray-600 mr-2" />
              <div>
                <div className="font-medium text-gray-900">{branchInfo.name}</div>
                {branchInfo.address && (
                  <div className="text-sm text-gray-600">{branchInfo.address}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingInsights
