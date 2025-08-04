import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Mail, 
  DollarSign, 
  Calendar, 
  User, 
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock
} from "lucide-react"

function InvoicesTable({ 
  invoices = [], 
  onView = () => {}, 
  onDelete = () => {}, 
  onStatusUpdate = () => {}, 
  onSendEmail = () => {} 
}) {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const pageSize = 10

  // Status configurations
  const statusConfig = {
    PENDING: { 
      color: "bg-yellow-100 text-yellow-800", 
      icon: Clock,
      label: "Pending" 
    },
    PAID: { 
      color: "bg-green-100 text-green-800", 
      icon: CheckCircle,
      label: "Paid" 
    },
    OVERDUE: { 
      color: "bg-red-100 text-red-800", 
      icon: AlertCircle,
      label: "Overdue" 
    },
    CANCELLED: { 
      color: "bg-gray-100 text-gray-800", 
      icon: XCircle,
      label: "Cancelled" 
    }
  }

  // Filter and search invoices
  const filteredInvoices = useMemo(() => {
    // Ensure invoices is always an array and handle different API response structures
    let invoicesArray = []
    
    if (Array.isArray(invoices)) {
      invoicesArray = invoices
    } else if (invoices && typeof invoices === 'object') {
      // Handle case where API returns {data: [...]} or similar structure
      invoicesArray = Array.isArray(invoices.data) ? invoices.data : []
    }
    
    let filtered = invoicesArray

    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      filtered = filtered.filter(invoice => {
        if (!invoice) return false
        
        const invoiceNumber = invoice.invoice_number?.toString().toLowerCase() || ''
        const customerName = invoice.customer?.name?.toString().toLowerCase() || ''
        const customerEmail = invoice.customer?.email?.toString().toLowerCase() || ''
        const searchLower = searchTerm.toLowerCase()
        
        return invoiceNumber.includes(searchLower) ||
               customerName.includes(searchLower) ||
               customerEmail.includes(searchLower)
      })
    }

    // Apply status filter
    if (statusFilter && statusFilter.trim()) {
      filtered = filtered.filter(invoice => invoice && invoice.status === statusFilter)
    }

    return filtered
  }, [invoices, searchTerm, statusFilter])

  // Paginate invoices
  const totalPages = Math.ceil((filteredInvoices?.length || 0) / pageSize)
  const paginatedInvoices = useMemo(() => {
    // Ensure filteredInvoices is always an array
    if (!Array.isArray(filteredInvoices)) {
      return []
    }
    const startIndex = (page - 1) * pageSize
    return filteredInvoices.slice(startIndex, startIndex + pageSize)
  }, [filteredInvoices, page, pageSize])

  // Helper functions
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.PENDING
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  const canDelete = (invoice) => {
    return invoice.status === 'PENDING' || invoice.status === 'CANCELLED'
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 border-b">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by invoice number, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[150px]"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  {searchTerm || statusFilter ? "No invoices match your search criteria" : "No invoices found"}
                </td>
              </tr>
            ) : (
              paginatedInvoices
                .filter(invoice => invoice && invoice.id) // Filter out null/undefined invoices
                .map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {invoice.invoice_number || `INV-${invoice.id}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {invoice.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {invoice.customer?.name || "Unknown Customer"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.customer?.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(invoice.created_at)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 font-medium text-gray-900">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      {formatCurrency(invoice.total)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(invoice)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSendEmail(invoice.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>

                      {canDelete(invoice) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(invoice)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {Math.min((page - 1) * pageSize + 1, filteredInvoices?.length || 0)} to{" "}
            {Math.min(page * pageSize, filteredInvoices?.length || 0)} of {filteredInvoices?.length || 0} invoices
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoicesTable
