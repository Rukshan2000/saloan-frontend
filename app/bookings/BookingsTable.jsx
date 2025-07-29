import React, { useState } from "react"
import { Button } from "@/components/ui/button"

function BookingsTable({ bookings, onEdit, onDelete }) {
  // Get user from redux (same as Navbar.jsx)
  // Get user from redux (same as Navbar.jsx)
  // Use import { useSelector } from "react-redux" for consistency
  const { useSelector } = require("react-redux");
  const user = useSelector((state) => state.auth.user);
  // Pagination state
  const [page, setPage] = useState(1)
  const pageSize = 6
  const totalPages = Math.ceil(bookings.length / pageSize)
  // Filter bookings for logged in user (customer)
  const filteredBookings = user && user.id
    ? bookings.filter(b => String(b.customer_id) === String(user.id))
    : bookings;
  const paginatedBookings = filteredBookings.slice((page - 1) * pageSize, page * pageSize)

  const [selectedBooking, setSelectedBooking] = useState(null);

  return (
    <>
      {/* Display logged in user's ID at the top (same as Navbar.jsx) */}
      {/* {user && (
        // <div className="mb-4 text-sm text-gray-700">
        //   Logged in User ID: <span className="font-bold">{user.id}</span>
        // </div>
      )} */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {paginatedBookings.map((booking) => (
          <div key={booking.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">ID: {booking.id}</span>
              <span className="text-xs text-gray-400">{booking.date}</span>
            </div>
            <div className="text-sm text-gray-600">Status: {booking.status}</div>
            <div className="text-sm text-gray-600">Customer Name: {booking.name}</div>
            <div className="text-sm text-gray-600">Beautician: {booking.beautician_name}</div>
            <div className="text-sm text-gray-600">Branch: {booking.branch_name}</div>
            <div className="text-sm text-gray-600">Time: {booking.time_slot}</div>
            <div className="text-sm text-gray-600">Service(s): {booking.service_name && booking.service_name.trim().length > 0 ? booking.service_name : "No services"}</div>
            <div className="flex gap-2 mt-auto">
              <Button size="sm" variant="outline" onClick={() => onEdit(booking)}>
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(booking)}>
                Delete
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setSelectedBooking(booking)}>
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Booking Details Popup */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setSelectedBooking(null)}>
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <div className="space-y-2">
              <div><span className="font-semibold">ID:</span> {selectedBooking.id}</div>
              <div><span className="font-semibold">Date:</span> {selectedBooking.date}</div>
              <div><span className="font-semibold">Status:</span> {selectedBooking.status}</div>
              <div><span className="font-semibold">Customer ID:</span> {selectedBooking.customer_id}</div>
              <div><span className="font-semibold">Customer Name:</span> {selectedBooking.name}</div>
              <div><span className="font-semibold">Customer Email:</span> {selectedBooking.email}</div>
              <div><span className="font-semibold">Beautician ID:</span> {selectedBooking.beautician_id}</div>
              <div><span className="font-semibold">Beautician Name:</span> {selectedBooking.beautician_name}</div>
              <div><span className="font-semibold">Branch ID:</span> {selectedBooking.branch_id}</div>
              <div><span className="font-semibold">Branch Name:</span> {selectedBooking.branch_name}</div>
              <div><span className="font-semibold">Time Slot ID:</span> {selectedBooking.time_slot_id}</div>
              <div><span className="font-semibold">Time:</span> {selectedBooking.time_slot}</div>
              <div><span className="font-semibold">Service IDs:</span> {Array.isArray(selectedBooking.service_ids) ? selectedBooking.service_ids.join(", ") : ""}</div>
              <div><span className="font-semibold">Service Names:</span> {selectedBooking.service_name && selectedBooking.service_name.trim().length > 0 ? selectedBooking.service_name : "No services"}</div>
              <div><span className="font-semibold">Services:</span></div>
              <ul className="ml-4 list-disc text-xs text-gray-700">
                {Array.isArray(selectedBooking.services) && selectedBooking.services.length > 0 ? (
                  selectedBooking.services.map((service, idx) => {
                    let serviceName = "";
                    if (Array.isArray(selectedBooking.service_ids) && selectedBooking.service_name) {
                      const ids = selectedBooking.service_ids.map(id => String(id));
                      const names = selectedBooking.service_name.split(",").map(n => n.trim());
                      const index = ids.indexOf(String(service.id));
                      if (index !== -1 && names[index]) {
                        serviceName = names[index];
                      }
                    }
                    return (
                      <li key={idx}>
                        ID: {service.id}, Name: {serviceName ? serviceName : "N/A"}, Price: {service.price}, Duration: {service.duration}
                      </li>
                    );
                  })
                ) : (
                  <li>No services</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <Button size="sm" variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </Button>
          <span className="px-3 text-sm text-gray-700">Page {page} of {totalPages}</span>
          <Button size="sm" variant="outline" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}
    </>
  )
}

export default BookingsTable
