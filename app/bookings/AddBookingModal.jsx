import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Check, Clock, Calendar, MapPin, User, Sparkles, AlertCircle, Search } from "lucide-react"

import { 
  useGetAvailableTimeSlotsQuery,
  useFindBestBeauticianQuery,
  useGetAvailableBeauticiansQuery 
} from "@/redux/features/appointmentServicesApi"
import { useSmartBookingMutation } from "@/redux/features/appointmentsApi"
import AvailableBeauticiansDisplay from "@/components/AvailableBeauticiansDisplay"
import SmartBookingIndicator from "@/components/SmartBookingIndicator"
import BookingInsights from "@/components/BookingInsights"

function AddBookingModal({ open, onClose, onAdd, services, branches, beauticians }) {
  const [bookingError, setBookingError] = useState(null)
  const [serviceSearch, setServiceSearch] = useState("")
  const [servicePage, setServicePage] = useState(1)
  const servicesPerPage = 5
  
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      return user?.id || ""
    } catch {
      return ""
    }
  }

  const [currentStep, setCurrentStep] = useState(1)
  const [bookingMode, setBookingMode] = useState("auto") // "auto" or "manual"
  const [smartBooking, { isLoading: isSmartBooking }] = useSmartBookingMutation()
  const [form, setForm] = useState({
    service_ids: [],
    branch_id: "",
    beautician_id: "",
    time_slot_id: "",
    date: "",
    name: "",
    email: "",
    customer_id: getUserId(),
    start_time: "",
    end_time: ""
  })

  // Calculate total duration of selected services
  const totalDuration = useMemo(() => {
    return form.service_ids.reduce((sum, sid) => {
      const service = services.find(s => String(s.id) === sid)
      return sum + (service?.duration || 0)
    }, 0)
  }, [form.service_ids, services])

  // Filter and paginate services
  const filteredServices = useMemo(() => {
    if (!serviceSearch.trim()) return services
    
    return services.filter(service =>
      service.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(serviceSearch.toLowerCase())) ||
      (service.category && service.category.toLowerCase().includes(serviceSearch.toLowerCase()))
    )
  }, [services, serviceSearch])

  const totalServicePages = Math.ceil(filteredServices.length / servicesPerPage)
  const paginatedServices = useMemo(() => {
    const startIndex = (servicePage - 1) * servicesPerPage
    return filteredServices.slice(startIndex, startIndex + servicesPerPage)
  }, [filteredServices, servicePage, servicesPerPage])

  // Reset service page when search changes
  useEffect(() => {
    setServicePage(1)
  }, [serviceSearch])

  // Smart booking: Find best available beautician
  const { 
    data: bestBeautician, 
    isLoading: findingBest,
    refetch: refindBest 
  } = useFindBestBeauticianQuery({
    service_ids: form.service_ids,
    date: form.date,
    branch_id: form.branch_id || undefined
  }, { 
    skip: !form.service_ids.length || !form.date || bookingMode !== "auto"
  })

  // Get all available beauticians for manual selection
  const { 
    data: availableBeauticians = [], 
    isLoading: loadingBeauticians 
  } = useGetAvailableBeauticiansQuery({
    service_ids: form.service_ids,
    date: form.date,
    branch_id: form.branch_id || undefined
  }, { 
    skip: !form.service_ids.length || !form.date || bookingMode !== "manual"
  })

  // Fetch available time slots for selected beautician
  const { data: availableTimeSlots = [], isLoading: slotsLoading } = useGetAvailableTimeSlotsQuery({
    beautician_id: form.beautician_id,
    total_duration: totalDuration,
    date: form.date
  }, { skip: !form.beautician_id || totalDuration === 0 || !form.date })

  const steps = [
    { id: 1, title: "Services", description: "Choose your services" },
    { id: 2, title: "Booking Mode", description: "Auto or manual selection" },
    { id: 3, title: "Location", description: "Select branch & beautician" },
    { id: 4, title: "Schedule", description: "Pick date & time" },
    { id: 5, title: "Details", description: "Your information" },
    { id: 6, title: "Confirm", description: "Review booking" }
  ]

  // Auto-fill beautician when best beautician is found
  useEffect(() => {
    if (bestBeautician && bookingMode === "auto") {
      setForm(prev => ({
        ...prev,
        beautician_id: bestBeautician.beautician_id,
        start_time: bestBeautician.start_time,
        end_time: bestBeautician.end_time
      }))
    }
  }, [bestBeautician, bookingMode])

  useEffect(() => {
    const id = getUserId()
    if (id) {
      setForm((prev) => ({ ...prev, customer_id: id }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    // If time_slot_id or date changes, update start/end times
    if (name === "time_slot_id" || name === "date") {
      const slot = availableTimeSlots.find(t => t.id === value || t.id === form.time_slot_id)
      if (slot) {
        // Calculate end time
        const [startHour, startMinute] = slot.start_time.split(":").map(Number)
        const endDate = new Date(form.date || value)
        endDate.setHours(startHour)
        endDate.setMinutes(startMinute + totalDuration)
        const endHour = String(endDate.getHours()).padStart(2, "0")
        const endMinute = String(endDate.getMinutes()).padStart(2, "0")
        setForm(prev => ({
          ...prev,
          start_time: slot.start_time,
          end_time: `${endHour}:${endMinute}`
        }))
      }
    }
  }

  const handleServiceToggle = (serviceId) => {
    const value = String(serviceId)
    setForm(prev => {
      const selected = prev.service_ids.includes(value)
        ? prev.service_ids.filter(id => id !== value)
        : [...prev.service_ids, value]
      return { ...prev, service_ids: selected }
    })
  }

  const resetServicePagination = () => {
    setServiceSearch("")
    setServicePage(1)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return form.service_ids.length > 0
      case 2: return bookingMode === "auto" || bookingMode === "manual"
      case 3: 
        if (bookingMode === "auto") {
          return true // Branch is optional for auto mode
        }
        return form.beautician_id
      case 4: 
        if (bookingMode === "auto") {
          return form.date && bestBeautician
        }
        return form.date && form.time_slot_id
      case 5: 
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return form.name && form.email && emailRegex.test(form.email)
      default: return true
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    const id = getUserId()
    
    // Reset any previous errors
    setBookingError(null)
    
    // Additional validation
    if (!id) {
      setBookingError("Please log in to make a booking")
      return
    }
    
    const selectedDate = new Date(form.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      setBookingError("Cannot book appointments for past dates")
      return
    }
    
    try {
      // For auto mode, use smart booking API
      if (bookingMode === "auto") {
        const smartBookingData = {
          customer_id: parseInt(id),
          service_ids: form.service_ids.map(sid => parseInt(sid)),
          date: form.date,
          branch_id: form.branch_id ? parseInt(form.branch_id) : null,
          name: form.name,
          email: form.email
        }
        
        const result = await smartBooking(smartBookingData).unwrap()
        
        // Notify parent component of successful booking
        if (onAdd) {
          onAdd(result)
        }
      } else {
        // Manual mode - ensure start/end times are set from selected slot
        let start_time = form.start_time
        let end_time = form.end_time
        
        if (!start_time || !end_time) {
          const slot = availableTimeSlots.find(t => t.id === form.time_slot_id)
          if (slot) {
            const [startHour, startMinute] = slot.start_time.split(":").map(Number)
            const endDate = new Date(form.date)
            endDate.setHours(startHour)
            endDate.setMinutes(startMinute + totalDuration)
            const endHour = String(endDate.getHours()).padStart(2, "0")
            const endMinute = String(endDate.getMinutes()).padStart(2, "0")
            start_time = slot.start_time
            end_time = `${endHour}:${endMinute}`
          }
        }
        
        // Use traditional booking for manual mode
        if (onAdd) {
          onAdd({ ...form, customer_id: id, start_time, end_time })
        }
      }
      
      // Reset form
      setForm({
        service_ids: [],
        branch_id: "",
        beautician_id: "",
        time_slot_id: "",
        date: "",
        name: "",
        email: "",
        customer_id: id,
        start_time: "",
        end_time: ""
      })
      setCurrentStep(1)
      setBookingMode("auto")
      setBookingError(null)
      resetServicePagination()
      onClose()
    } catch (error) {
      console.error('Booking failed:', error)
      if (error.data?.message) {
        setBookingError(error.data.message)
      } else if (error.message) {
        setBookingError(error.message)
      } else {
        setBookingError("Booking failed. Please try again or contact support.")
      }
    }
  }

  const getSelectedServiceNames = () => {
    return services
      .filter(s => form.service_ids.includes(String(s.id)))
      .map(s => s.name)
      .join(", ")
  }

  const getSelectedBranchName = () => {
    return branches.find(b => b.id === form.branch_id)?.name || ""
  }

  const getSelectedBeauticianName = () => {
    return beauticians.find(b => b.id === form.beautician_id)?.name || ""
  }

  const getSelectedTimeSlot = () => {
    const slot = availableTimeSlots.find(t => t.id === form.time_slot_id)
    return slot ? `${slot.start_time} - ${slot.end_time}` : ""
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light text-black">Book Appointment</h2>
            <button 
              onClick={() => {
                resetServicePagination()
                onClose()
              }}
              className="text-gray-400 hover:text-black transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all ${
                    currentStep > step.id 
                      ? 'bg-black text-white border-black' 
                      : currentStep === step.id 
                        ? 'border-black text-black bg-white' 
                        : 'border-gray-300 text-gray-300'
                  }`}>
                    {currentStep > step.id ? <Check size={16} /> : step.id}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-xs font-medium ${
                      currentStep >= step.id ? 'text-black' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${
                    currentStep > step.id ? 'bg-black' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {bookingError && (
          <div className="mx-6 mb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle size={16} className="text-red-600 mr-2" />
                <span className="font-medium text-red-800">Booking Error</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{bookingError}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 h-[500px] overflow-y-auto">
          {/* Step 1: Services */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-black mb-2">Select Services</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Choose one or more services for your appointment
                  {serviceSearch && (
                    <span className="ml-1">
                      (showing {filteredServices.length} of {services.length} services)
                    </span>
                  )}
                </p>
              </div>

              {/* Service Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                />
              </div>

              {/* Services List */}
              <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="grid grid-cols-1 gap-3">
                  {paginatedServices.length > 0 ? (
                    paginatedServices.map((service) => (
                      <label 
                        key={service.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:border-black bg-white ${
                          form.service_ids.includes(String(service.id))
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={form.service_ids.includes(String(service.id))}
                          onChange={() => handleServiceToggle(service.id)}
                        />
                        <div className={`w-4 h-4 border rounded mr-3 flex items-center justify-center ${
                          form.service_ids.includes(String(service.id))
                            ? 'bg-black border-black'
                            : 'border-gray-300'
                        }`}>
                          {form.service_ids.includes(String(service.id)) && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-black font-medium">{service.name}</span>
                          {(service.duration || service.price) && (
                            <div className="text-xs text-gray-500 mt-1">
                              {service.duration && `${service.duration} min`}
                              {service.duration && service.price && " • "}
                              {service.price && `$${service.price}`}
                            </div>
                          )}
                          {service.description && (
                            <div className="text-xs text-gray-400 mt-1">{service.description}</div>
                          )}
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Search size={24} className="mx-auto mb-2 opacity-50" />
                      <p>No services found matching "{serviceSearch}"</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setServiceSearch("")}
                        className="mt-2"
                      >
                        Clear search
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination */}
              {totalServicePages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {((servicePage - 1) * servicesPerPage) + 1} to {Math.min(servicePage * servicesPerPage, filteredServices.length)} of {filteredServices.length} services
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setServicePage(prev => Math.max(1, prev - 1))}
                      disabled={servicePage === 1}
                      className="px-3 py-1"
                    >
                      <ChevronLeft size={14} />
                    </Button>
                    <span className="px-3 py-1 text-sm text-gray-600">
                      {servicePage} of {totalServicePages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setServicePage(prev => Math.min(totalServicePages, prev + 1))}
                      disabled={servicePage === totalServicePages}
                      className="px-3 py-1"
                    >
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              )}
              
              {form.service_ids.length > 0 && (
                <div className="text-sm text-gray-600 mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium text-blue-800 mb-1">Selection Summary</div>
                  <div>Selected {form.service_ids.length} service{form.service_ids.length > 1 ? 's' : ''}</div>
                  {totalDuration > 0 && <div>Total duration: {totalDuration} minutes</div>}
                  <div className="mt-2">
                    <div className="text-xs text-blue-700">Selected services:</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {form.service_ids.map(sid => {
                        const service = services.find(s => String(s.id) === sid)
                        return service?.name
                      }).filter(Boolean).join(", ")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Booking Mode */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-black mb-2">Choose Booking Method</h3>
                <p className="text-gray-600 text-sm mb-4">Select how you'd like to book your appointment</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <label 
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-black ${
                    bookingMode === "auto" ? 'border-black bg-gray-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="bookingMode"
                    value="auto"
                    checked={bookingMode === "auto"}
                    onChange={(e) => setBookingMode(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border rounded-full mr-3 mt-1 flex items-center justify-center ${
                    bookingMode === "auto" ? 'bg-black border-black' : 'border-gray-300'
                  }`}>
                    {bookingMode === "auto" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <Sparkles size={16} className="mr-2 text-black" />
                      <span className="text-black font-medium">Smart Booking (Recommended)</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Let our system automatically find the best available beautician and time slot for your services. 
                      Quick and optimized for your preferences.
                    </p>
                  </div>
                </label>

                <label 
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-black ${
                    bookingMode === "manual" ? 'border-black bg-gray-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="bookingMode"
                    value="manual"
                    checked={bookingMode === "manual"}
                    onChange={(e) => setBookingMode(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border rounded-full mr-3 mt-1 flex items-center justify-center ${
                    bookingMode === "manual" ? 'bg-black border-black' : 'border-gray-300'
                  }`}>
                    {bookingMode === "manual" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <User size={16} className="mr-2 text-black" />
                      <span className="text-black font-medium">Manual Selection</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Choose your preferred branch, beautician, and time slot manually. 
                      Full control over your booking preferences.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {bookingMode === "auto" ? (
                <div>
                  <h3 className="text-lg font-medium text-black mb-2">Choose Branch (Optional)</h3>
                  <p className="text-gray-600 text-sm mb-4">Select a preferred branch or leave empty for all branches</p>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Branch</label>
                    <select 
                      name="branch_id" 
                      value={form.branch_id} 
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                    >
                      <option value="">All branches (Recommended)</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Selecting a specific branch may limit available time slots
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-medium text-black mb-2">Choose Location & Beautician</h3>
                    <p className="text-gray-600 text-sm mb-4">Select your preferred branch and beautician manually</p>
                  </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Branch (Optional)</label>
                <select 
                  name="branch_id" 
                  value={form.branch_id} 
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                >
                  <option value="">All branches</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Available Beauticians
                  {form.service_ids.length > 0 && (
                    <span className="text-xs text-gray-500 ml-2">
                      (can perform all selected services)
                    </span>
                  )}
                </label>
                
                <AvailableBeauticiansDisplay
                  beauticians={availableBeauticians}
                  selectedBeauticianId={form.beautician_id}
                  onSelectBeautician={(beautician) => setForm({...form, beautician_id: beautician.id})}
                  isLoading={loadingBeauticians}
                />
              </div>
                </>
              )}
            </div>
          )}

          {/* Step 4: Schedule */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-black mb-2">Schedule Appointment</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {bookingMode === "auto" 
                    ? "Select your preferred date and we'll find the best available time"
                    : "Pick your preferred date and time"
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Date</label>
                <Input 
                  name="date" 
                  type="date" 
                  value={form.date} 
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select a future date. Availability depends on beautician schedules and business hours.
                </p>
              </div>

              {bookingMode === "auto" && form.date && (
                <SmartBookingIndicator
                  isLoading={findingBest}
                  bestBeautician={bestBeautician}
                  error={!findingBest && !bestBeautician && form.date ? { message: "No available slots found for the selected date" } : null}
                  beauticians={beauticians}
                  branches={branches}
                />
              )}

              {bookingMode === "manual" && (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Available Time Slots
                    {form.beautician_id && (
                      <span className="text-xs text-gray-500 ml-2">
                        for {beauticians.find(b => b.id === form.beautician_id)?.name}
                      </span>
                    )}
                  </label>
                  <select 
                    name="time_slot_id" 
                    value={form.time_slot_id} 
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                    disabled={slotsLoading || !form.beautician_id}
                  >
                    <option value="">
                      {slotsLoading ? "Loading..." : 
                       !form.beautician_id ? "Select a beautician first" :
                       "Select time slot"}
                    </option>
                    {availableTimeSlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.start_time} - {slot.end_time}
                      </option>
                    ))}
                  </select>
                  
                  {form.time_slot_id && (
                    <div className="text-sm text-gray-600 mt-2">
                      <span>Estimated End Time: </span>
                      <span className="font-medium text-black">{form.end_time}</span>
                    </div>
                  )}
                  
                  {form.beautician_id && form.date && !slotsLoading && availableTimeSlots.length === 0 && (
                    <div className="text-sm text-amber-600 mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                      No available time slots for the selected beautician on this date. 
                      Try selecting a different date or beautician.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Details */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-black mb-2">Your Information</h3>
                <p className="text-gray-600 text-sm mb-4">Please provide your contact details</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Full Name</label>
                <Input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Email Address</label>
                <Input 
                  name="email" 
                  type="email"
                  value={form.email} 
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={`w-full p-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors ${
                    form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'border-red-300 bg-red-50' : ''
                  }`}
                />
                {form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                  <p className="text-xs text-red-600 mt-1">Please enter a valid email address</p>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Confirmation */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-black mb-2">Confirm Booking</h3>
                <p className="text-gray-600 text-sm mb-4">Please review all your appointment details</p>
              </div>
              
              <BookingInsights
                totalServices={form.service_ids.length}
                totalDuration={totalDuration}
                estimatedPrice={form.service_ids.reduce((sum, sid) => {
                  const service = services.find(s => String(s.id) === sid)
                  return sum + (parseFloat(service?.price) || 0)
                }, 0)}
                selectedServices={form.service_ids.map(sid => {
                  const service = services.find(s => String(s.id) === sid)
                  return service ? {
                    name: service.name,
                    duration: service.duration || 0,
                    price: service.price || 0
                  } : null
                }).filter(Boolean)}
                bestTimeSlot={bookingMode === "auto" && bestBeautician ? {
                  start_time: bestBeautician.start_time,
                  end_time: bestBeautician.end_time
                } : null}
                branchInfo={getSelectedBranchName() ? {
                  name: getSelectedBranchName()
                } : null}
              />
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                {/* Services List with price/duration */}
                <div className="py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Services:</span>
                  <ul className="mt-2 ml-2">
                    {form.service_ids.map(sid => {
                      const service = services.find(s => String(s.id) === sid)
                      return service ? (
                        <li key={sid} className="flex justify-between items-center py-1">
                          <span className="text-black">{service.name}</span>
                          <span className="text-gray-600 text-xs">Price: {service.price || "-"} | Duration: {service.duration || "-"} min</span>
                        </li>
                      ) : null
                    })}
                  </ul>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Booking Mode:</span>
                  <span className="text-black font-medium">
                    {bookingMode === "auto" ? "Smart Booking" : "Manual Selection"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Branch:</span>
                  <span className="text-black font-medium">
                    {getSelectedBranchName() || "Any branch"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Beautician:</span>
                  <span className="text-black font-medium">
                    {bookingMode === "auto" && bestBeautician
                      ? beauticians.find(b => b.id === bestBeautician.beautician_id)?.name || "N/A"
                      : getSelectedBeauticianName()
                    }
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-black font-medium">{form.date}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Time:</span>
                  <span className="text-black font-medium">
                    {bookingMode === "auto" && bestBeautician
                      ? `${bestBeautician.start_time} - ${bestBeautician.end_time}`
                      : getSelectedTimeSlot()
                    }
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Contact:</span>
                  <span className="text-black font-medium">{form.name} ({form.email})</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Customer ID:</span>
                  <span className="text-black font-medium">{form.customer_id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-black font-medium">
                    {form.status === 'CANCELED' ? 'CANCELED' : form.status === 'CONFIRMED' ? 'CONFIRMED' : 'SCHEDULED'}
                  </span>
                </div>
                {form.receipt_number && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Receipt #:</span>
                    <span className="text-black font-medium">{form.receipt_number}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? () => {
                resetServicePagination()
                onClose()
              } : handlePrev}
              className="px-6 py-2 border border-gray-300 text-gray-700 hover:border-black hover:text-black transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            {currentStep < 6 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className={`px-6 py-2 transition-colors ${
                  canProceed()
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSmartBooking}
                className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSmartBooking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <Check size={16} className="ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBookingModal