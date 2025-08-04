"use client"
import React, { useState } from "react"
import AddInvoiceModal from "./AddInvoiceModal"
import DeleteInvoiceModal from "./DeleteInvoiceModal"
import ViewInvoiceModal from "./ViewInvoiceModal"
import InvoicesTable from "./InvoicesTable"
import InvoicesDashboard from "./InvoicesDashboard"
import SuccessNotification from "@/components/SuccessNotification"
import BookingErrorNotification from "@/components/BookingErrorNotification"
import { 
  useGetInvoicesQuery,
  useCreateInvoiceFromAppointmentMutation,
  useDeleteInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useSendInvoiceEmailMutation 
} from "@/redux/features/invoicesApi"
import { useGetAppointmentsQuery } from "@/redux/features/appointmentsApi"
import { useGetUsersQuery } from "@/redux/features/usersApi"
import { Button } from "@/components/ui/button"

export default function InvoicesPage() {
  const { data: invoices = [], isLoading, refetch, error } = useGetInvoicesQuery()
  const { data: appointments = [] } = useGetAppointmentsQuery()
  const { data: users = [] } = useGetUsersQuery()
  
  const [createInvoiceFromAppointment] = useCreateInvoiceFromAppointmentMutation()
  const [deleteInvoice] = useDeleteInvoiceMutation()
  const [updateInvoiceStatus] = useUpdateInvoiceStatusMutation()
  const [sendInvoiceEmail] = useSendInvoiceEmailMutation()

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Filter customers (users with role 1)
  const customers = users.filter(u => u.role === 1)

  const handleAddInvoice = async (invoiceData) => {
    try {
      const result = await createInvoiceFromAppointment(invoiceData).unwrap()
      setAddModalOpen(false)
      setSuccessMessage("Invoice created successfully!")
      setShowSuccessNotification(true)
      setTimeout(() => setShowSuccessNotification(false), 3000)
      refetch()
    } catch (error) {
      console.error("Error creating invoice:", error)
      setErrorMessage(error?.data?.message || "Failed to create invoice")
      setShowErrorNotification(true)
      setTimeout(() => setShowErrorNotification(false), 5000)
    }
  }

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      await deleteInvoice(invoiceId).unwrap()
      setDeleteModalOpen(false)
      setSelectedInvoice(null)
      setSuccessMessage("Invoice deleted successfully!")
      setShowSuccessNotification(true)
      setTimeout(() => setShowSuccessNotification(false), 3000)
      refetch()
    } catch (error) {
      console.error("Error deleting invoice:", error)
      setErrorMessage(error?.data?.message || "Failed to delete invoice")
      setShowErrorNotification(true)
      setTimeout(() => setShowErrorNotification(false), 5000)
    }
  }

  const handleStatusUpdate = async (invoiceId, status) => {
    try {
      await updateInvoiceStatus({ id: invoiceId, status }).unwrap()
      setSuccessMessage(`Invoice status updated to ${status}!`)
      setShowSuccessNotification(true)
      setTimeout(() => setShowSuccessNotification(false), 3000)
      refetch()
    } catch (error) {
      console.error("Error updating invoice status:", error)
      setErrorMessage(error?.data?.message || "Failed to update invoice status")
      setShowErrorNotification(true)
      setTimeout(() => setShowErrorNotification(false), 5000)
    }
  }

  const handleSendEmail = async (invoiceId) => {
    try {
      await sendInvoiceEmail(invoiceId).unwrap()
      setSuccessMessage("Invoice email sent successfully!")
      setShowSuccessNotification(true)
      setTimeout(() => setShowSuccessNotification(false), 3000)
    } catch (error) {
      console.error("Error sending invoice email:", error)
      setErrorMessage(error?.data?.message || "Failed to send invoice email")
      setShowErrorNotification(true)
      setTimeout(() => setShowErrorNotification(false), 5000)
    }
  }

  const openDeleteModal = (invoice) => {
    setSelectedInvoice(invoice)
    setDeleteModalOpen(true)
  }

  const openViewModal = (invoice) => {
    setSelectedInvoice(invoice)
    setViewModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
                <p className="mt-2 text-gray-600">
                  Manage salon invoices, track payments, and send email notifications
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    console.log('Manual refetch triggered')
                    refetch()
                  }}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Refresh Data
                </Button>
                <Button 
                  onClick={() => setAddModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create Invoice
                </Button>
              </div>
            </div>
        </div>

        {/* Dashboard Cards */}
        <InvoicesDashboard />

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading invoices...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-red-600">
                <p className="font-medium">Error loading invoices</p>
                <p className="text-sm mt-1">{error?.data?.message || error?.message || "Unknown error"}</p>
                <button 
                  onClick={() => refetch()}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <InvoicesTable 
              invoices={invoices}
              onView={openViewModal}
              onDelete={openDeleteModal}
              onStatusUpdate={handleStatusUpdate}
              onSendEmail={handleSendEmail}
            />
          )}
        </div>

        {/* Modals */}
        <AddInvoiceModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddInvoice}
          appointments={appointments}
          customers={customers}
        />

        <DeleteInvoiceModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleDeleteInvoice}
          invoice={selectedInvoice}
        />

        <ViewInvoiceModal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          invoice={selectedInvoice}
          onStatusUpdate={handleStatusUpdate}
          onSendEmail={handleSendEmail}
        />

        {/* Notifications */}
        <SuccessNotification 
          show={showSuccessNotification}
          message={successMessage}
          onClose={() => setShowSuccessNotification(false)}
        />

        <BookingErrorNotification 
          show={showErrorNotification}
          message={errorMessage}
          onClose={() => setShowErrorNotification(false)}
        />
      </div>
    </div>
  )
}
