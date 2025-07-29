"use client"
import React, { useState } from "react"
import { useGetTimeSlotsQuery, useCreateTimeSlotMutation, useUpdateTimeSlotMutation, usePatchTimeSlotMutation, useDeleteTimeSlotMutation } from "@/redux/features/timeSlotsApi"
import AddTimeslotModal from "./AddTimeslotModal"
import DeleteTimeslotModal from "./DeleteTimeslotModal"
import TimeslotsTable from "./TimeslotsTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TimeSlotsPage() {
  const { data: timeSlots = [], isLoading } = useGetTimeSlotsQuery()
  const [createTimeSlot] = useCreateTimeSlotMutation()
  const [updateTimeSlot] = useUpdateTimeSlotMutation()
  const [patchTimeSlot] = usePatchTimeSlotMutation()
  const [deleteTimeSlot] = useDeleteTimeSlotMutation()

  const [form, setForm] = useState({ start_time: "", end_time: "" })
  const [editId, setEditId] = useState(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTimeslot, setSelectedTimeslot] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = async (timeslot) => {
    await createTimeSlot(timeslot)
  }

  const handleEdit = (slot) => {
    setForm({ start_time: slot.start_time, end_time: slot.end_time })
    setEditId(slot.id)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (editId) {
      await updateTimeSlot({ id: editId, ...form })
      setEditId(null)
      setForm({ start_time: "", end_time: "" })
    }
  }

  const handlePatch = async (slot) => {
    await patchTimeSlot({ id: slot.id, start_time: slot.start_time, end_time: slot.end_time })
  }

  const handleDelete = async (id) => {
    await deleteTimeSlot(id)
    setDeleteModalOpen(false)
    setSelectedTimeslot(null)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Time Slots Management</h1>
      <div className="mb-6 flex gap-2">
        <Button onClick={() => setAddModalOpen(true)}>Add Timeslot</Button>
        {editId && (
          <form onSubmit={handleUpdate} className="flex gap-2">
            <Input name="start_time" type="time" value={form.start_time} onChange={handleChange} placeholder="Start Time" required />
            <Input name="end_time" type="time" value={form.end_time} onChange={handleChange} placeholder="End Time" required />
            <Button type="submit">Update</Button>
            <Button type="button" variant="outline" onClick={() => { setEditId(null); setForm({ start_time: "", end_time: "" }) }}>Cancel</Button>
          </form>
        )}
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <TimeslotsTable
          timeSlots={timeSlots}
          onEdit={handleEdit}
          onPatch={handlePatch}
          onDelete={(slot) => { setSelectedTimeslot(slot); setDeleteModalOpen(true) }}
        />
      )}
      <AddTimeslotModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAdd}
      />
      <DeleteTimeslotModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        timeslot={selectedTimeslot}
      />
    </div>
  )
}
