import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { 
  useGetServicesQuery 
} from "@/redux/features/servicesApi"
import { 
  useGetUsersQuery 
} from "@/redux/features/usersApi"
import { 
  useGetBranchesQuery 
} from "@/redux/features/branchesApi"
import { 
  usePatchAppointmentMutation 
} from "@/redux/features/appointmentsApi"
import { 
  useGetAppointmentServicesQuery 
} from "@/redux/features/appointmentServicesApi"
import { Search, Filter, Calendar, User, MapPin, Clock, DollarSign } from "lucide-react"

function BookingsTable({ bookings, onEdit, onDelete }) {
  const user = useSelector((state) => state.auth.user)
  
  // Fetch related data
  const { data: services = [] } = useGetServicesQuery()
  const { data: users = [] } = useGetUsersQuery()
  const { data: branches = [] } = useGetBranchesQuery()
  const { data: appointmentServices = [] } = useGetAppointmentServicesQuery()
  const [patchAppointment, { isLoading: isUpdating }] = usePatchAppointmentMutation()
  
  // Local state
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedBooking, setSelectedBooking] = useState(null)
  
  const pageSize = 6
  
  // Get beauticians from users
  const beauticians = users.filter(u => u.role === 2)
  
  // Helper functions to get names and calculate prices
  const getServiceDetails = (appointmentId) => {
    if (!appointmentId) return []
    
    const appointmentServiceRecords = appointmentServices.filter(
      as => String(as.appointment_id) === String(appointmentId)
    )
    
    return appointmentServiceRecords.map(record => {
      const service = services.find(s => String(s.id) === String(record.service_id))
      return {
        id: record.service_id,
        name: service?.name || `Service ${record.service_id}`,
        price: parseFloat(service?.price || 0),
        duration: parseInt(service?.duration || 0)
      }
    })
  }
  
  const getServiceNames = (appointmentId) => {
    const serviceDetails = getServiceDetails(appointmentId)
    return serviceDetails.length > 0 
      ? serviceDetails.map(s => s.name).join(", ")
      : "No services"
  }
  
  const getBeauticianName = (beauticianId) => {
    if (!beauticianId) return "Not assigned"
    const beautician = beauticians.find(b => String(b.id) === String(beauticianId))
    return beautician?.name || `Beautician ${beauticianId}`
  }
  
  const getBranchName = (branchId) => {
    if (!branchId) return "Not assigned"
    const branch = branches.find(b => String(b.id) === String(branchId))
    return branch?.name || `Branch ${branchId}`
  }
  
  const calculateTotalPrice = (appointmentId) => {
    const serviceDetails = getServiceDetails(appointmentId)
    const total = serviceDetails.reduce((sum, service) => sum + service.price, 0)
    return total.toFixed(2)
  }
  
  const calculateTotalDuration = (appointmentId) => {
    const serviceDetails = getServiceDetails(appointmentId)
    return serviceDetails.reduce((sum, service) => sum + service.duration, 0)
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
  
  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'CANCELED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  
  // Filter bookings for logged in user (customer)
  const filteredBookings = useMemo(() => {
    let filtered = bookings
    
    // Filter by user if logged in
    if (user && user.id) {
      filtered = filtered.filter(b => String(b.customer_id) === String(user.id))
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(booking => 
        booking.name?.toLowerCase().includes(search) ||
        booking.email?.toLowerCase().includes(search) ||
        getServiceNames(booking.id).toLowerCase().includes(search) ||
        getBeauticianName(booking.beautician_id).toLowerCase().includes(search) ||
        getBranchName(booking.branch_id).toLowerCase().includes(search) ||
        booking.status?.toLowerCase().includes(search)
      )
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }
    
    return filtered
  }, [bookings, user, searchTerm, statusFilter, services, beauticians, branches, appointmentServices])
  
  const totalPages = Math.ceil(filteredBookings.length / pageSize)
  const paginatedBookings = filteredBookings.slice((page - 1) * pageSize, page * pageSize)
  
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await patchAppointment({ id: bookingId, status: newStatus }).unwrap()
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-400 bg-white"
            />
          </div>
          
          {/* Status Filter */}
          <select
            className="w-full sm:w-48 px-4 py-2.5 border border-gray-200 rounded-lg text-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-500 whitespace-nowrap">
          {filteredBookings.length === 0 ? (
            "No results"
          ) : (
            `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filteredBookings.length)} of ${filteredBookings.length}`
          )}
        </div>
      </div>

      {/* Bookings Grid */}
      {paginatedBookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex flex-col items-center">
            <Calendar className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || statusFilter ? "Try adjusting your search or filters" : "You haven't made any bookings yet"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">ID: {booking.id}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(booking.date)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Customer Info */}
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-900 mb-1">
                    <User size={14} className="mr-2" />
                    {booking.name || 'Unknown Customer'}
                  </div>
                  <div className="text-xs text-gray-500 ml-5">{booking.email || 'No email'}</div>
                </div>

                {/* Beautician */}
                <div className="flex items-center text-sm text-gray-600">
                  <User size={14} className="mr-2" />
                  <span className="font-medium">Beautician:</span>
                  <span className="ml-1">{getBeauticianName(booking.beautician_id)}</span>
                </div>

                {/* Branch */}
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={14} className="mr-2" />
                  <span className="font-medium">Branch:</span>
                  <span className="ml-1">{getBranchName(booking.branch_id)}</span>
                </div>

                {/* Services */}
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-1">Services:</div>
                  <div className="text-xs bg-gray-50 p-2 rounded border">
                    {getServiceNames(booking.id)}
                  </div>
                </div>

                {/* Price and Duration */}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center text-green-600">
                    <DollarSign size={14} className="mr-1" />
                    ${calculateTotalPrice(booking.id)}
                  </div>
                  <div className="flex items-center text-blue-600">
                    <Clock size={14} className="mr-1" />
                    {calculateTotalDuration(booking.id)} min
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => onDelete(booking)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => setSelectedBooking(booking)}
                    className="flex-1"
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Booking Details Popup */}
      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
              <button 
                className="text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => setSelectedBooking(null)}
              >
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{selectedBooking.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(selectedBooking.date)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{selectedBooking.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-sm">{selectedBooking.email}</span>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Service Information</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Beautician:</span>
                    <span className="font-medium">{getBeauticianName(selectedBooking.beautician_id)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Branch:</span>
                    <span className="font-medium">{getBranchName(selectedBooking.branch_id)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Duration:</span>
                    <span className="font-medium">{calculateTotalDuration(selectedBooking.id)} minutes</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Price:</span>
                    <span className="font-medium text-green-600">${calculateTotalPrice(selectedBooking.id)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Details */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4">Selected Services</h3>
              
              {(() => {
                const serviceDetails = getServiceDetails(selectedBooking.id)
                return serviceDetails.length > 0 ? (
                  <div className="space-y-3">
                    {serviceDetails.map((service, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-600">Duration: {service.duration} minutes</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-green-600">${service.price.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No services selected
                  </div>
                )
              })()}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setPage(page - 1)} 
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-3 text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setPage(page + 1)} 
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default BookingsTable
