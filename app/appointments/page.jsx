"use client";
import React, { useState } from "react";
import AddAppointmentModal from "./AddAppointmentModal";
import DeleteAppointmentModal from "./DeleteAppointmentModal";
import AppointmentsTable from "./AppointmentsTable";
import ViewAppointmentModal from "./ViewAppointmentModal";
import { 
  useCreateAppointmentMutation, 
  useDeleteAppointmentMutation,
  useGetAppointmentsQuery 
} from "@/redux/features/appointmentsApi";
import { useGetUsersQuery } from "@/redux/features/usersApi";
import { useGetBranchesQuery } from "@/redux/features/branchesApi";
import { useGetServicesQuery } from "@/redux/features/servicesApi";
import { Button } from "@/components/ui/button";

export default function AppointmentsPage() {

  const { data: appointments = [], isLoading, refetch } = useGetAppointmentsQuery();
  // Get beauticians from usersApi (assuming role or type filter is handled in the API or client)
  const { data: users = [] } = useGetUsersQuery();
  // Filter beauticians if needed (e.g., by role: 2)
  const beauticians = users.filter(u => u.role === 2);
  const { data: branches = [] } = useGetBranchesQuery();
  const { data: services = [] } = useGetServicesQuery();
  const [createAppointment] = useCreateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const handleAdd = async (appt) => {
    await createAppointment(appt);
    refetch();
  };

  const handleDelete = async (appt) => {
    await deleteAppointment(appt);
    refetch();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
      </div>
      <AppointmentsTable 
        appointments={appointments} 
        beauticians={beauticians}
        branches={branches}
        services={services}
        onDelete={a => setDeleteTarget(a)} 
        onView={a => setViewTarget(a)}
      />
      {isLoading && <div className="text-gray-500">Loading...</div>}
      {showAdd && (
        <AddAppointmentModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />
      )}
      {deleteTarget && (
        <DeleteAppointmentModal appointment={deleteTarget} onDelete={handleDelete} onClose={() => setDeleteTarget(null)} />
      )}
      {viewTarget && (
        <ViewAppointmentModal 
          appointment={viewTarget} 
          services={services} 
          beauticians={beauticians}
          branches={branches}
          onClose={() => setViewTarget(null)} 
        />
      )}
    </div>
  );
}
