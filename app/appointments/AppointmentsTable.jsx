import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { usePatchAppointmentMutation } from "@/redux/features/appointmentsApi";

function getBeauticianName(beauticians, id) {
  const found = beauticians.find(b => String(b.id) === String(id));
  return found ? (found.name || found.full_name || found.username || found.email || found.id) : id || "-";
}

function getBranchName(branches, id) {
  const found = branches.find(b => String(b.id) === String(id));
  return found ? (found.name || found.branch_name || found.id) : id || "-";
}

export default function AppointmentsTable({ appointments, beauticians = [], branches = [], onDelete, onView }) {
  const user = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [patchAppointment, { isLoading: isUpdating }] = usePatchAppointmentMutation();

  const statusOptions = [
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "CANCELLED", label: "Canceled" },
    { value: "COMPLETED", label: "Completed" },
  ];

  // For beautician, only allow confirmed/completed
  const allowedStatusOptions = user?.role === 2
    ? statusOptions.filter(opt => ["CONFIRMED", "COMPLETED"].includes(opt.value))
    : statusOptions;

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;
    // If beautician, only show their bookings
    if (user?.role === 2) {
      filtered = filtered.filter(a => String(a.beautician_id) === String(user.id));
    }
    // If role 2, only show confirmed bookings
    if (user?.role === 2) {
      filtered = filtered.filter(a => ["CONFIRMED", "COMPLETED"].includes(a.status));
    }
    if (statusFilter) {
      filtered = filtered.filter(a => a.status === statusFilter);
    }
    if (!search) return filtered;
    const lower = search.toLowerCase();
    return filtered.filter(a =>
      (a.name || a.customer || "").toLowerCase().includes(lower) ||
      (a.email || "").toLowerCase().includes(lower) ||
      (a.status || "").toLowerCase().includes(lower) ||
      getBeauticianName(beauticians, a.beautician_id).toLowerCase().includes(lower) ||
      getBranchName(branches, a.branch_id).toLowerCase().includes(lower)
    );
  }, [appointments, beauticians, branches, search, statusFilter, user]);

  const totalPages = Math.ceil(filteredAppointments.length / pageSize) || 1;
  const paginatedAppointments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAppointments.slice(start, start + pageSize);
  }, [filteredAppointments, page, pageSize]);

  React.useEffect(() => { setPage(1); }, [search]);

  const getStatusBadge = (status) => {
    const badges = {
      SCHEDULED: "bg-orange-100 text-gray-800 border-orange-200",
      CONFIRMED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200"
    };
    return badges[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm 
                         focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                         placeholder-gray-400 bg-white"
            />
            <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            className="w-full sm:w-48 px-4 py-2.5 border border-gray-200 rounded-lg text-sm 
                       focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                       bg-white"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {(user?.role === 2
              ? statusOptions.filter(opt => ["CONFIRMED", "COMPLETED"].includes(opt.value))
              : statusOptions
            ).map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-gray-500 whitespace-nowrap">
          {filteredAppointments.length === 0 ? (
            "No results"
          ) : (
            `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filteredAppointments.length)} of ${filteredAppointments.length}`
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Beautician
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-500 text-sm">No appointments found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAppointments.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {a.name || a.customer || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {a.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {a.date ? a.date.split(" ")[0] : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {a.id ? (
                        <select
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border 
                                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                                    ${getStatusBadge(a.status)} cursor-pointer`}
                          value={a.status || ""}
                          disabled={isUpdating}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            if (newStatus !== a.status) {
                              // If beautician, only allow confirmed/completed
                              if (user?.role === 2 && !["CONFIRMED", "COMPLETED"].includes(newStatus)) return;
                              await patchAppointment({ id: a.id, status: newStatus });
                            }
                          }}
                        >
                          <option value="" disabled>Select status</option>
                          {allowedStatusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full border border-red-200">
                          No ID
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {getBeauticianName(beauticians, a.beautician_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {getBranchName(branches, a.branch_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => onView(a)} 
                          className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors duration-150"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => onDelete(a)} 
                          className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors duration-150"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredAppointments.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
          </p>
          
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg
                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed 
                         transition-colors duration-150"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-gray-600 rounded-lg
                         hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed 
                         transition-colors duration-150"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}