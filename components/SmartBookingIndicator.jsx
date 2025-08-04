import React from 'react'
import { Sparkles, Clock, User, MapPin, Check, AlertCircle } from 'lucide-react'

const SmartBookingIndicator = ({ 
  isLoading = false, 
  bestBeautician = null, 
  error = null,
  beauticians = [],
  branches = [] 
}) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <AlertCircle size={16} className="text-red-600 mr-2" />
          <span className="font-medium text-red-800">Smart Booking Error</span>
        </div>
        <p className="text-sm text-red-700">
          {error.message || "Unable to find available slots. Please try manual selection."}
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
          <div className="text-center">
            <div className="font-medium text-blue-800 mb-1">
              Finding Perfect Match...
            </div>
            <div className="text-sm text-blue-700">
              Analyzing beautician availability and service requirements
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (bestBeautician) {
    const beautician = beauticians.find(b => b.id === bestBeautician.beautician_id)
    const branch = branches.find(b => b.id === beautician?.branch_id)

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <div className="bg-green-100 rounded-full p-2 mr-3">
            <Sparkles size={16} className="text-green-600" />
          </div>
          <div>
            <div className="font-medium text-green-800">Perfect Match Found!</div>
            <div className="text-sm text-green-700">
              Optimal slot found based on your preferences
            </div>
          </div>
          <Check size={20} className="text-green-600 ml-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center">
            <User size={16} className="text-gray-500 mr-2" />
            <div>
              <div className="text-xs text-gray-600">Beautician</div>
              <div className="font-medium text-gray-900">
                {beautician?.name || "N/A"}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock size={16} className="text-gray-500 mr-2" />
            <div>
              <div className="text-xs text-gray-600">Time</div>
              <div className="font-medium text-gray-900">
                {bestBeautician.start_time} - {bestBeautician.end_time}
              </div>
            </div>
          </div>
          
          {branch && (
            <div className="flex items-center">
              <MapPin size={16} className="text-gray-500 mr-2" />
              <div>
                <div className="text-xs text-gray-600">Branch</div>
                <div className="font-medium text-gray-900">
                  {branch.name}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default SmartBookingIndicator
