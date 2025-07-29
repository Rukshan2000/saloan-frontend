import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

import { useGetAvailableTimeSlotsQuery } from "@/redux/features/timeSlotsApi"

function AddBookingModal({ open, onClose, onAdd, services, branches, beauticians }) {
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      return user?.id || ""
    } catch {
      return ""
    }
  }

  const [currentStep, setCurrentStep] = useState(1)
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

  // Fetch available time slots with total_duration param
  const { data: availableTimeSlots = [], isLoading: slotsLoading } = useGetAvailableTimeSlotsQuery({
    beautician_id: form.beautician_id,
    total_duration: totalDuration,
    date: form.date
  }, { skip: !form.beautician_id || totalDuration === 0 || !form.date })

  const steps = [
    { id: 1, title: "Services", description: "Choose your services" },
    { id: 2, title: "Location", description: "Select branch & beautician" },
    { id: 3, title: "Schedule", description: "Pick date & time" },
    { id: 4, title: "Details", description: "Your information" },
    { id: 5, title: "Confirm", description: "Review booking" }
  ]

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

  const canProceed = () => {
    switch (currentStep) {
      case 1: return form.service_ids.length > 0
      case 2: return form.branch_id && form.beautician_id
      case 3: return form.date && form.time_slot_id
      case 4: return form.name && form.email
      default: return true
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    const id = getUserId()
    // Ensure start/end times are set
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
    onAdd({ ...form, customer_id: id, start_time, end_time })
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
    onClose()
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
              onClick={onClose}
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

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {/* Step 1: Services */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-black mb-2">Select Services</h3>
                <p className="text-gray-600 text-sm mb-4">Choose one or more services for your appointment</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {services.map((service) => (
                  <label 
                    key={service.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:border-black ${
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
                    <span className="text-black font-medium">{service.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-black mb-2">Choose Location</h3>
                <p className="text-gray-600 text-sm mb-4">Select your preferred branch and beautician</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Branch</label>
                <select 
                  name="branch_id" 
                  value={form.branch_id} 
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                >
                  <option value="">Select a branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Beautician</label>
                <select 
                  name="beautician_id" 
                  value={form.beautician_id} 
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                >
                  <option value="">Select a beautician</option>
                  {beauticians.map((beautician) => (
                    <option key={beautician.id} value={beautician.id}>{beautician.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-black mb-2">Schedule Appointment</h3>
                <p className="text-gray-600 text-sm mb-4">Pick your preferred date and time</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Date</label>
                <Input 
                  name="date" 
                  type="date" 
                  value={form.date} 
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Time Slot</label>
                <select 
                  name="time_slot_id" 
                  value={form.time_slot_id} 
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                  disabled={slotsLoading}
                >
                  <option value="">{slotsLoading ? "Loading..." : "Select time slot"}</option>
                  {availableTimeSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.start_time} - {slot.end_time}
                    </option>
                  ))}
                </select>
              </div>
              {form.time_slot_id && (
                <div className="text-sm text-gray-600 mt-2">
                  <span>Estimated End Time: </span>
                  <span className="font-medium text-black">{form.end_time}</span>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Details */}
          {currentStep === 4 && (
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
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-black mb-2">Confirm Booking</h3>
                <p className="text-gray-600 text-sm mb-4">Please review all your appointment details</p>
              </div>
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
                  <span className="text-gray-600">Branch:</span>
                  <span className="text-black font-medium">{getSelectedBranchName()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Beautician:</span>
                  <span className="text-black font-medium">{getSelectedBeauticianName()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-black font-medium">{form.date}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Time:</span>
                  <span className="text-black font-medium">{getSelectedTimeSlot()}</span>
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
              onClick={currentStep === 1 ? onClose : handlePrev}
              className="px-6 py-2 border border-gray-300 text-gray-700 hover:border-black hover:text-black transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            {currentStep < 5 ? (
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
                className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Confirm Booking
                <Check size={16} className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBookingModal