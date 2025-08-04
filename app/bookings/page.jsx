"use client"
import React, { useState, useEffect } from "react"
import AddBookingModal from "./AddBookingModal"
import DeleteBookingModal from "./DeleteBookingModal"
import BookingsTable from "./BookingsTable"
import BookingsDashboard from "@/components/BookingsDashboard"
import SuccessNotification from "@/components/SuccessNotification"
// import SmartBookingInfoCard from "@/components/SmartBookingInfoCard"
import BookingErrorNotification from "@/components/BookingErrorNotification"
import { useGetServicesQuery } from "@/redux/features/servicesApi"
import { useGetTimeSlotsQuery } from "@/redux/features/timeSlotsApi"
import { useGetBeauticianAvailabilityQuery } from "@/redux/features/beauticianAvailabilityApi"
import { useGetUsersQuery } from "@/redux/features/usersApi"
import { useGetBranchesQuery } from "@/redux/features/branchesApi"
import { 
  useCreateAppointmentMutation, 
  useDeleteAppointmentMutation,
  useGetAppointmentsQuery 
} from "@/redux/features/appointmentsApi"
import { Button } from "@/components/ui/button"

export default function BookingsPage() {
  const { data: services = [] } = useGetServicesQuery()
  const { data: timeSlots = [] } = useGetTimeSlotsQuery()
  const { data: beauticianAvailability = [] } = useGetBeauticianAvailabilityQuery()
  const { data: users = [] } = useGetUsersQuery()
  const { data: branches = [] } = useGetBranchesQuery()
  const [createAppointment] = useCreateAppointmentMutation()
  const [deleteAppointment] = useDeleteAppointmentMutation()

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showInfoCard, setShowInfoCard] = useState(true)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const beauticians = users.filter((u) => u.role === 2)

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      return user?.id || ""
    } catch {
      return ""
    }
  }

  // Get appointments for the logged-in user
  const userId = getUserId()
  const { data: appointments = [], refetch: refetchAppointments } = useGetAppointmentsQuery(userId, {
    skip: !userId // Skip query if no user ID
  })

  // Transform appointments data for the table
  const transformAppointments = () => {
    return appointments.map(appointment => {
      // Get service names using service_ids and services API query
      const serviceNames = Array.isArray(appointment.service_ids) && appointment.service_ids.length > 0
        ? appointment.service_ids.map(serviceId => {
            const service = services.find(s => String(s.id) === String(serviceId))
            return service?.name || ""
          }).filter(Boolean).join(", ")
        : ""

      return {
        ...appointment, // Pass all original fields
        customer_id: appointment.customer_id, // Explicitly pass customer_id for clarity
        service_name: serviceNames,
        branch_name: branches.find(b => String(b.id) === String(appointment.branch_id))?.name || "",
        beautician_name: beauticians.find(u => String(u.id) === String(appointment.beautician_id))?.name || "",
        time_slot: timeSlots.find(t => String(t.id) === String(appointment.time_slot_id))
          ? `${timeSlots.find(t => String(t.id) === String(appointment.time_slot_id)).start_time} - ${timeSlots.find(t => String(t.id) === String(appointment.time_slot_id)).end_time}`
          : "",
        status: appointment.status === 'CANCELED' ? 'CANCELED' : appointment.status === 'CONFIRMED' ? 'CONFIRMED' : 'SCHEDULED'
      }
    })
  }

  const handleAddBooking = async (bookingData) => {
    try {
      // Check if this is a smart booking result (already created) or manual booking data
      if (bookingData.id) {
        // This is a smart booking result that was already created by the API
        console.log("Smart booking created successfully:", bookingData)
        setSuccessMessage("Smart booking created successfully! Your appointment has been optimally scheduled.")
      } else {
        // This is manual booking data that needs to be created
        const customerId = getUserId()
        const serviceDetails = Array.isArray(bookingData.service_ids)
          ? bookingData.service_ids.map(id => {
              const service = services.find(s => String(s.id) === String(id))
              return service ? { id: service.id, price: service.price, duration: service.duration } : null
            }).filter(Boolean)
          : []

        await createAppointment({
          customer_id: customerId,
          beautician_id: bookingData.beautician_id,
          branch_id: bookingData.branch_id,
          time_slot_id: bookingData.time_slot_id,
          date: bookingData.date,
          status: "SCHEDULED",
          name: bookingData.name,
          email: bookingData.email,
          service_ids: bookingData.service_ids,
          services: serviceDetails
        })
        
        setSuccessMessage("Booking created successfully! Your appointment has been scheduled.")
      }

      refetchAppointments() // Refresh the appointments list
      setAddModalOpen(false)
      setShowSuccessNotification(true)
    } catch (error) {
      console.error("Error creating appointment:", error)
      setErrorMessage(
        error.data?.message || 
        error.message || 
        "Failed to create booking. Please try again or contact support."
      )
      setShowErrorNotification(true)
    }
  }

  const handleDeleteBooking = async (id) => {
    try {
      await deleteAppointment(id)
      refetchAppointments() // Refresh the appointments list
      setDeleteModalOpen(false)
      setSelectedBooking(null)
    } catch (error) {
      console.error("Error deleting appointment:", error)
      setErrorMessage(
        error.data?.message || 
        error.message || 
        "Failed to delete booking. Please try again or contact support."
      )
      setShowErrorNotification(true)
    }
  }

  const handleEditBooking = (booking) => {
    // Implement edit logic or modal if needed
    console.log("Edit booking:", booking)
  }

  return (
    <div className="max-w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bookings Management</h1>
      
      {/* {showInfoCard && (
        <SmartBookingInfoCard onClose={() => setShowInfoCard(false)} />
      )} */}
      
      <BookingsDashboard bookings={transformAppointments()} />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Your Bookings</h2>
        <Button onClick={() => setAddModalOpen(true)}>Add Booking</Button>
      </div>
      <BookingsTable
        bookings={transformAppointments()}
        customerId={userId}
        onEdit={handleEditBooking}
        onDelete={(booking) => { setSelectedBooking(booking); setDeleteModalOpen(true) }}
      />
      <AddBookingModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddBooking}
        services={services}
        branches={branches}
        beauticians={beauticians}
        timeSlots={timeSlots}
      />
      <DeleteBookingModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteBooking}
        booking={selectedBooking}
      />
      
      <SuccessNotification
        show={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
        title="Booking Success!"
        message={successMessage}
      />

      <BookingErrorNotification
        show={showErrorNotification}
        onClose={() => setShowErrorNotification(false)}
        title="Booking Error"
        message={errorMessage}
      />
    </div>
  )
}