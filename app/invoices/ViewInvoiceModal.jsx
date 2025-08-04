import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  X, 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Mail, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
  Download
} from "lucide-react"

function ViewInvoiceModal({ open, onClose, invoice, onStatusUpdate, onSendEmail }) {
  const [statusLoading, setStatusLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  if (!open || !invoice) return null

  const statusConfig = {
    PENDING: { 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      icon: Clock,
      label: "Pending",
      nextStatus: "PAID"
    },
    PAID: { 
      color: "bg-green-100 text-green-800 border-green-200", 
      icon: CheckCircle,
      label: "Paid",
      nextStatus: null
    },
    OVERDUE: { 
      color: "bg-red-100 text-red-800 border-red-200", 
      icon: AlertCircle,
      label: "Overdue",
      nextStatus: "PAID"
    },
    CANCELLED: { 
      color: "bg-gray-100 text-gray-800 border-gray-200", 
      icon: XCircle,
      label: "Cancelled",
      nextStatus: null
    }
  }

  const currentStatus = statusConfig[invoice.status] || statusConfig.PENDING
  const StatusIcon = currentStatus.icon

  const formatDate = (dateString) => {
    if (!dateString) return "Not set"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return "Invalid date"
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return "Not set"
    try {
      const time = new Date(`2000-01-01T${timeString}`)
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return timeString
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const handleStatusUpdate = async (newStatus) => {
    setStatusLoading(true)
    try {
      await onStatusUpdate(invoice.id, newStatus)
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setStatusLoading(false)
    }
  }

  const handleSendEmail = async () => {
    setEmailLoading(true)
    try {
      await onSendEmail(invoice.id)
    } catch (error) {
      console.error("Error sending email:", error)
    } finally {
      setEmailLoading(false)
    }
  }

  const getServices = () => {
    // This would depend on your data structure
    // You might need to fetch services data based on appointment
    return invoice.appointment?.services || []
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Invoice {invoice.invoice_number || `INV-${invoice.id}`}
              </h2>
              <p className="text-sm text-gray-600">
                Created on {formatDate(invoice.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${currentStatus.color}`}>
              <StatusIcon className="w-4 h-4" />
              {currentStatus.label}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                <User className="w-5 h-5" />
                Customer Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-medium">{invoice.customer?.name || "Unknown Customer"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium">{invoice.customer?.email || "No email"}</p>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            {invoice.appointment && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                  <Calendar className="w-5 h-5" />
                  Appointment Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Date:</span>
                    <p className="font-medium">{formatDate(invoice.appointment.date)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Time:</span>
                    <p className="font-medium">
                      {formatTime(invoice.appointment.start_time)} - {formatTime(invoice.appointment.end_time)}
                    </p>
                  </div>
                  {invoice.appointment.branch && (
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">Branch:</span>
                      <p className="font-medium">{invoice.appointment.branch.name}</p>
                    </div>
                  )}
                  {invoice.appointment.beautician && (
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">Beautician:</span>
                      <p className="font-medium">{invoice.appointment.beautician.name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Services */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
                <FileText className="w-5 h-5" />
                Services
              </h3>
              <div className="space-y-2">
                {getServices().length > 0 ? (
                  getServices().map((service, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        {service.category && (
                          <p className="text-sm text-gray-600">{service.category.name}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(service.price)}</p>
                        {service.duration && (
                          <p className="text-sm text-gray-600">{service.duration} min</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No services information available</p>
                )}
              </div>
            </div>

            {/* Invoice Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="flex items-center gap-2 font-medium text-blue-900 mb-3">
                <DollarSign className="w-5 h-5" />
                Invoice Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Total Amount:</span>
                  <span className="text-xl font-bold text-blue-900">{formatCurrency(invoice.total)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-700">Status:</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${currentStatus.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {currentStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSendEmail}
              disabled={emailLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {emailLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send Email
                </div>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {currentStatus.nextStatus && (
              <Button
                onClick={() => handleStatusUpdate(currentStatus.nextStatus)}
                disabled={statusLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {statusLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </div>
                ) : (
                  `Mark as ${currentStatus.nextStatus}`
                )}
              </Button>
            )}
            
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewInvoiceModal
