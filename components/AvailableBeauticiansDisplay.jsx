import React from 'react'
import { Clock, MapPin, Star, User } from 'lucide-react'

const AvailableBeauticiansDisplay = ({ 
  beauticians = [], 
  selectedBeauticianId, 
  onSelectBeautician,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-3"></div>
        <span className="text-gray-600">Loading available beauticians...</span>
      </div>
    )
  }

  if (beauticians.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <User className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
        <h3 className="font-medium text-yellow-800 mb-2">No Available Beauticians</h3>
        <p className="text-sm text-yellow-700">
          No beauticians are available for the selected services and date. 
          Please try a different date or adjust your service selection.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 mb-4">
        Available Beauticians ({beauticians.length})
      </h4>
      
      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {beauticians.map((beautician) => (
          <div
            key={beautician.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedBeauticianId === beautician.id
                ? 'border-black bg-gray-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectBeautician(beautician)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">
                  {beautician.name}
                </h5>
                
                {beautician.branch_name && (
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {beautician.branch_name}
                  </div>
                )}
                
                {beautician.rating && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {beautician.rating}
                  </div>
                )}
              </div>
              
              {selectedBeauticianId === beautician.id && (
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
            
            {beautician.available_slots && beautician.available_slots.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  Available Time Slots
                </div>
                <div className="flex flex-wrap gap-2">
                  {beautician.available_slots.slice(0, 6).map((slot, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded border"
                    >
                      {slot.start_time} - {slot.end_time}
                    </span>
                  ))}
                  {beautician.available_slots.length > 6 && (
                    <span className="px-2 py-1 text-xs text-gray-500">
                      +{beautician.available_slots.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {(!beautician.available_slots || beautician.available_slots.length === 0) && (
              <div className="border-t border-gray-100 pt-3">
                <span className="text-sm text-orange-600">
                  Limited availability - check schedule
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AvailableBeauticiansDisplay
