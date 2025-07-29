"use client"
import React, { useState, useEffect } from "react"
import AddBookingModal from "./AddBookingModal"
import DeleteBookingModal from "./DeleteBookingModal"
import BookingsTable from "./BookingsTable"
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

  const handleAddBooking = async (form) => {
    try {
      const customerId = getUserId()
      const serviceDetails = Array.isArray(form.service_ids)
        ? form.service_ids.map(id => {
            const service = services.find(s => String(s.id) === String(id))
            return service ? { id: service.id, price: service.price, duration: service.duration } : null
          }).filter(Boolean)
        : []

      await createAppointment({
        customer_id: customerId,
        beautician_id: form.beautician_id,
        branch_id: form.branch_id,
        time_slot_id: form.time_slot_id,
        date: form.date,
        status: "SCHEDULED",
        name: form.name,
        email: form.email,
        service_ids: form.service_ids,
        services: serviceDetails
      })

      refetchAppointments() // Refresh the appointments list
      setAddModalOpen(false)
    } catch (error) {
      console.error("Error creating appointment:", error)
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
    }
  }

  const handleEditBooking = (booking) => {
    // Implement edit logic or modal if needed
    console.log("Edit booking:", booking)
  }

  return (
    <div className="max-w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Bookings Management</h1>
      <Button onClick={() => setAddModalOpen(true)} className="mb-4">Add Booking</Button>
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
    </div>
  )
}