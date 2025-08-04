import React, { useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'

const BookingErrorNotification = ({ 
  show = false, 
  onClose, 
  title = "Booking Error", 
  message = "An error occurred while processing your booking.",
  autoClose = true,
  autoCloseDelay = 5000 
}) => {
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)
      
      return () => clearTimeout(timer)
    }
  }, [show, autoClose, autoCloseDelay, onClose])

  if (!show) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              {title}
            </h3>
            <div className="mt-1 text-sm text-red-700">
              <p>{message}</p>
            </div>
          </div>
          <div className="ml-3 flex-shrink-0">
            <button
              className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
              onClick={onClose}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingErrorNotification
