"use client"
import React, { useState } from "react"
import { useGetUsersQuery } from "@/redux/features/usersApi"
import {
  useGetBeauticianAvailabilityQuery,
  useCreateBeauticianAvailabilityMutation,
  useUpdateBeauticianAvailabilityMutation,
  useDeleteBeauticianAvailabilityMutation,
} from "@/redux/features/beauticianAvailabilityApi"
import AddBeauticianAvailabilityModal from "./AddBeauticianAvailabilityModal"
import BeauticianAvailabilityTable from "./BeauticianAvailabilityTable"
import DeleteBeauticianAvailabilityModal from "./DeleteBeauticianAvailabilityModal"
import { Button } from "@/components/ui/button"

export default function BeauticianAvailabilityPage() {
  const { data: availabilities = [], isLoading } = useGetBeauticianAvailabilityQuery()
  const [createAvailability] = useCreateBeauticianAvailabilityMutation()
  const [updateAvailability] = useUpdateBeauticianAvailabilityMutation()
  const [deleteAvailability] = useDeleteBeauticianAvailabilityMutation()

  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery()
  const beauticians = users.filter((u) => u.role === 2)

  // Get user from redux
  const user = (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__)
    ? null // fallback for SSR
    : require("react-redux").useSelector((state) => state.auth.user);
  const isBeautician = user?.role === 2;

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ beautician_id: "", day_of_week: "", start_time: "", end_time: "" })
  const [deleteId, setDeleteId] = useState(null)

  const handleAdd = () => {
    setForm({ beautician_id: "", day_of_week: "", start_time: "", end_time: "" })
    setEditId(null)
    setModalOpen(true)
  }

  const handleEdit = (item) => {
    setForm({
      beautician_id: item.beautician_id,
      day_of_week: item.day_of_week,
      start_time: item.start_time,
      end_time: item.end_time
    })
    setEditId(item.id)
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    setDeleteId(id)
    setDeleteModalOpen(true)
  }

  const handleModalSubmit = async (data) => {
    if (editId) {
      await updateAvailability({ id: editId, ...data })
    } else {
      await createAvailability(data)
    }
    setModalOpen(false)
    setEditId(null)
  }

  const handleDeleteConfirm = async () => {
    await deleteAvailability(deleteId)
    setDeleteModalOpen(false)
    setDeleteId(null)
  }

  return (
    <div className="max-w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Beautician Availability CRUD</h1>
      {!isBeautician && (
        <Button className="mb-4" onClick={handleAdd}>Add Availability</Button>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : usersLoading ? (
        <div>Loading beauticians...</div>
      ) : (
        <BeauticianAvailabilityTable
          availabilities={availabilities}
          beauticians={beauticians}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {modalOpen && (
        <AddBeauticianAvailabilityModal
          beauticians={beauticians}
          onSubmit={handleModalSubmit}
          initialForm={form}
          editId={editId}
          onClose={() => setModalOpen(false)}
        />
      )}
      <DeleteBeauticianAvailabilityModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
