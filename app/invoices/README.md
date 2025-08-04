# Invoice Management System - Frontend

This directory contains the frontend implementation of the comprehensive Invoice Management System for the salon application.

## Features

### 🎯 Core Functionality
- **Create invoices from appointments** - Generate invoices automatically from existing appointments
- **View invoice details** - Comprehensive invoice viewing with customer and appointment information
- **Status management** - Update invoice status (PENDING → PAID, OVERDUE, CANCELLED)
- **Email notifications** - Send invoice emails to customers
- **Search and filtering** - Find invoices by customer, status, date range
- **Statistics dashboard** - Real-time invoice and revenue statistics

### 📊 Dashboard Statistics
- Total invoices count
- Pending, Paid, Overdue, and Cancelled invoice counts
- Total revenue, Pending revenue, Monthly revenue
- Visual indicators for overdue invoices

### 🔍 Advanced Filtering
- Filter by invoice status (PENDING, PAID, OVERDUE, CANCELLED)
- Search by invoice number, customer name, or email
- Date range filtering
- Real-time search results

## File Structure

```
app/invoices/
├── page.jsx                  # Main invoices page with state management
├── InvoicesTable.jsx         # Table component with pagination and filtering
├── InvoicesDashboard.jsx     # Statistics dashboard with cards
├── AddInvoiceModal.jsx       # Modal for creating invoices from appointments
├── ViewInvoiceModal.jsx      # Modal for viewing invoice details
├── DeleteInvoiceModal.jsx    # Modal for deleting invoices (with restrictions)
└── README.md                 # This file
```

## Components Overview

### 📄 Main Page (`page.jsx`)
- Manages all state for the invoices section
- Handles API calls and error/success notifications
- Coordinates between all child components
- Implements loading states and error handling

### 📋 InvoicesTable (`InvoicesTable.jsx`)
- Displays invoices in a paginated table format
- Includes search and filter functionality
- Shows invoice status with color-coded badges
- Action buttons for view, email, and delete operations
- Responsive design with mobile-friendly layout

### 📊 InvoicesDashboard (`InvoicesDashboard.jsx`)
- Displays 8 key statistics cards
- Real-time data from API
- Visual indicators and color coding
- Loading and error states
- Hover animations and responsive grid

### ➕ AddInvoiceModal (`AddInvoiceModal.jsx`)
- Select appointments to create invoices from
- Search functionality for appointments
- Customer information display
- Email sending option
- Form validation and loading states

### 👁️ ViewInvoiceModal (`ViewInvoiceModal.jsx`)
- Comprehensive invoice details view
- Customer and appointment information
- Services breakdown with pricing
- Status update functionality
- Email sending capabilities
- Action buttons for status changes

### 🗑️ DeleteInvoiceModal (`DeleteInvoiceModal.jsx`)
- Safe deletion with status checking
- Only allows deletion of PENDING/CANCELLED invoices
- Confirmation dialog with invoice details
- Error handling for protected invoices

## API Integration

The frontend integrates with the backend API through Redux RTK Query:

### 📡 API Endpoints Used

```javascript
// Get all invoices with optional filtering
GET /api/v1/invoices?status=PENDING&customer_id=1&date_from=2025-01-01

// Get specific invoice details
GET /api/v1/invoices/{id}

// Get invoice statistics
GET /api/v1/invoices/statistics

// Create invoice from appointment
POST /api/v1/invoices/create-from-appointment
{
  "appointment_id": 1,
  "send_email": true
}

// Update invoice status
PATCH /api/v1/invoices/{id}/status
{
  "status": "PAID"
}

// Send invoice email
POST /api/v1/invoices/{id}/send-email

// Delete invoice
DELETE /api/v1/invoices/{id}
```

### 🔄 Redux Integration

All API calls are handled through `redux/features/invoicesApi.js`:

```javascript
import { 
  useGetInvoicesQuery,
  useGetInvoiceStatisticsQuery,
  useCreateInvoiceFromAppointmentMutation,
  useUpdateInvoiceStatusMutation,
  useSendInvoiceEmailMutation,
  useDeleteInvoiceMutation 
} from "@/redux/features/invoicesApi"
```

## Status Management

### 📊 Invoice Statuses
- **PENDING** 🟡 - Newly created, payment pending
- **PAID** 🟢 - Payment received and processed
- **OVERDUE** 🔴 - Pending for more than 30 days
- **CANCELLED** ⚫ - Invoice cancelled

### 🔒 Status Restrictions
- Only PENDING and CANCELLED invoices can be deleted
- Status transitions: PENDING → PAID, OVERDUE → PAID
- Automatic OVERDUE detection (handled by backend)

## User Experience Features

### 🎨 Visual Design
- Modern, clean interface with consistent styling
- Color-coded status indicators
- Responsive design for all screen sizes
- Loading states and animations
- Error and success notifications

### 🔍 Search & Filter
- Real-time search across multiple fields
- Status-based filtering
- Pagination for large datasets
- "No results" states with helpful messages

### 📱 Responsive Design
- Mobile-first approach
- Collapsible table on small screens
- Touch-friendly buttons and interactions
- Optimized for tablets and phones

## Error Handling

### 🚨 Comprehensive Error Management
- API error handling with user-friendly messages
- Form validation with real-time feedback
- Network error detection
- Graceful degradation for missing data

### 📢 Notifications
- Success notifications for completed actions
- Error notifications with detailed messages
- Auto-dismissing notifications
- Action confirmations

## Performance Optimizations

### ⚡ Efficiency Features
- Pagination to handle large datasets
- Debounced search to reduce API calls
- Memoized components to prevent unnecessary re-renders
- Lazy loading of modals
- Optimistic updates for better UX

### 🔄 Caching
- Redux RTK Query automatic caching
- Cache invalidation on data changes
- Background refetching for fresh data

## Security Considerations

### 🔐 Frontend Security
- Input sanitization and validation
- Role-based feature access
- Secure API communication
- Protection against common vulnerabilities

## Getting Started

### 🚀 Prerequisites
- Node.js 18+ installed
- Access to the backend API
- Proper environment configuration

### 🏃‍♂️ Quick Start
1. Ensure the backend Invoice API is running
2. Navigate to `/invoices` in the application
3. The dashboard will load with current statistics
4. Use "Create Invoice" to generate new invoices
5. Click on any invoice to view details

### 🔧 Configuration
The system automatically connects to the API through the existing Redux store configuration. No additional setup required.

## Troubleshooting

### 🐛 Common Issues

**Statistics not loading:**
- Check backend API connection
- Verify `/api/v1/invoices/statistics` endpoint

**Cannot create invoice:**
- Ensure appointment exists and is valid
- Check customer information is complete

**Email sending fails:**
- Verify backend email configuration
- Check customer email address validity

**Search not working:**
- Check if data is loaded properly
- Verify search terms are correct

### 📞 Support
For technical issues, check the browser console for error messages and verify API connectivity.

## Future Enhancements

### 🔮 Planned Features
- Bulk invoice operations
- PDF invoice generation
- Advanced reporting and analytics
- Invoice templates customization
- Payment gateway integration
- Automated reminder emails
- Export functionality (CSV, Excel)
- Audit trail for invoice changes

---

*This system provides a complete invoice management solution with modern UX patterns and robust error handling. All components are designed to be maintainable and extensible.*
