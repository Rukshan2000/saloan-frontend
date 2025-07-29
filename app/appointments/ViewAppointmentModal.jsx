import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, Clock, MapPin, UserCheck, FileText, Scissors } from "lucide-react";

// Helper to get service name by id
function getServiceName(services, id) {
  const found = services.find(s => String(s.id) === String(id));
  return found ? (found.name || found.service_name || found.title || found.id) : id;
}

// Helper to get beautician name by id
function getBeauticianName(beauticians, id) {
  const found = beauticians.find(b => String(b.id) === String(id));
  return found ? (found.name || found.full_name || found.username || found.email || found.id) : id || "-";
}

// Helper to get branch name by id
function getBranchName(branches, id) {
  const found = branches.find(b => String(b.id) === String(id));
  return found ? (found.name || found.branch_name || found.id) : id || "-";
}

export default function ViewAppointmentModal({ appointment, onClose, services = [], beauticians = [], branches = [] }) {
  const [activeTab, setActiveTab] = useState('details');
  if (!appointment) return null;

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-sm text-gray-600 block">{label}</span>
        <span className="text-gray-900 break-words">{value || '-'}</span>
      </div>
    </div>
  );

  const hasServices = Array.isArray(appointment.services) && appointment.services.length > 0;

  // Get beautician and branch names
  const beauticianName = getBeauticianName(beauticians, appointment.beautician_id);
  const branchName = getBranchName(branches, appointment.branch_id);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-100 p-6 pb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Appointment Details</h2>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Services {hasServices && <span className="ml-1 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{appointment.services.length}</span>}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'details' && (
            <div className="p-6 space-y-1">
              {/* Customer Info Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
                <InfoRow 
                  icon={User} 
                  label="Customer" 
                  value={appointment.name || appointment.customer} 
                />
                <InfoRow 
                  icon={Mail} 
                  label="Email" 
                  value={appointment.email} 
                />
              </div>

              {/* Appointment Details Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Appointment Information</h3>
                <InfoRow 
                  icon={Calendar} 
                  label="Date" 
                  value={appointment.date ? appointment.date.split(" ")[0] : null} 
                />
                <InfoRow 
                  icon={Clock} 
                  label="Status" 
                  value={appointment.status} 
                />
                <InfoRow 
                  icon={UserCheck} 
                  label="Beautician" 
                  value={beauticianName} 
                />
                <InfoRow 
                  icon={MapPin} 
                  label="Branch" 
                  value={branchName} 
                />
              </div>

              {/* Notes Section */}
              {appointment.notes && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
                  <InfoRow 
                    icon={FileText} 
                    label="Additional Notes" 
                    value={appointment.notes} 
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scissors className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900">Selected Services</h3>
              </div>
              
              {hasServices ? (
                <div className="space-y-4">
                  {appointment.services.map((s, idx) => (
                    <div key={s.id || idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-semibold text-gray-900 text-lg">
                          {getServiceName(services, s.id)}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {s.price}
                          </div>
                          <div className="text-sm text-gray-500">
                            {s.duration}m
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">Service ID:</span>
                          <span className="font-medium text-gray-900">{s.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium text-gray-900">{s.duration} minutes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span className="text-gray-700">Total Services:</span>
                      <span className="text-gray-900">{appointment.services.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold mt-2">
                      <span className="text-gray-700">Total Duration:</span>
                      <span className="text-gray-900">
                        {appointment.services.reduce((total, service) => total + (parseInt(service.duration) || 0), 0)} minutes
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Scissors className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No services selected for this appointment</p>
                  <p className="text-gray-400 text-sm mt-2">Services information will appear here when available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 pt-4">
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-6"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}