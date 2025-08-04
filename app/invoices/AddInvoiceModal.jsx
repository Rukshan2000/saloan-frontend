import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  X, 
  Search, 
  Calendar, 
  User, 
  FileText, 
  Mail,
  DollarSign,
  Clock
} from "lucide-react"

function AddInvoiceModal({ open, onClose, onAdd, appointments, customers }) {
  const [form, setForm] = useState({
    appointment_id: "",
    send_email: true
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [loading, setLoading] = useState(false)

  // Filter appointments that don't have invoices yet
  const availableAppointments = useMemo(() => {
    // Filter out appointments that already have invoices
    // You might want to add this logic based on your data structure
    return appointments.filter(apt => apt.status !== 'CANCELLED')
  }, [appointments])

  // Filter appointments based on search
  const filteredAppointments = useMemo(() => {
    if (!searchTerm.trim()) return availableAppointments
    
    return availableAppointments.filter(appointment => {
      const customer = customers.find(c => c.id === appointment.customer_id)
      const customerName = customer?.name || ""
      const customerEmail = customer?.email || ""
      
      return (
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.id.toString().includes(searchTerm) ||
        appointment.date?.includes(searchTerm)
      )
    })
  }, [availableAppointments, searchTerm, customers])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.appointment_id) {
      alert("Please select an appointment")
      return
    }

    setLoading(true)
    try {
      await onAdd(form)
      handleClose()
    } catch (error) {
      console.error("Error creating invoice:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setForm({ appointment_id: "", send_email: true })
    setSearchTerm("")
    setSelectedAppointment(null)
    onClose()
  }

  const handleAppointmentSelect = (appointment) => {
    setForm(prev => ({ ...prev, appointment_id: appointment.id }))
    setSelectedAppointment(appointment)
  }

  const getCustomerInfo = (customerId) => {
    return customers.find(c => c.id === customerId) || { name: "Unknown", email: "" }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not set"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
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

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Invoice</h2>
              <p className="text-sm text-gray-600">Generate an invoice from an appointment</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Appointments
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by customer name, email, or appointment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Selected Appointment */}
            {selectedAppointment && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">Selected Appointment</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">ID:</span> {selectedAppointment.id}
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span> {formatDate(selectedAppointment.date)}
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span> {formatTime(selectedAppointment.start_time)} - {formatTime(selectedAppointment.end_time)}
                  </div>
                  <div>
                    <span className="text-gray-600">Customer:</span> {getCustomerInfo(selectedAppointment.customer_id).name}
                  </div>
                </div>
              </div>
            )}

            {/* Appointments List */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Appointments ({filteredAppointments.length})
              </label>
              <div className="border border-gray-300 rounded-lg max-h-96 overflow-y-auto">
                {filteredAppointments.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    {searchTerm ? "No appointments match your search" : "No available appointments"}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => {
                      const customer = getCustomerInfo(appointment.customer_id)
                      const isSelected = form.appointment_id === appointment.id
                      
                      return (
                        <div
                          key={appointment.id}
                          className={`p-4 cursor-pointer transition-colors ${
                            isSelected 
                              ? "bg-blue-50 border-l-4 border-l-blue-500" 
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleAppointmentSelect(appointment)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {customer.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {customer.email}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(appointment.date)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Appointment ID: {appointment.id}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Email Option */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="send_email"
                checked={form.send_email}
                onChange={(e) => setForm(prev => ({ ...prev, send_email: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="send_email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4" />
                Send invoice email to customer
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!form.appointment_id || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Create Invoice
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddInvoiceModal
