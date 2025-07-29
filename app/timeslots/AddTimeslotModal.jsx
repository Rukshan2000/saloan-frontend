import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AddTimeslotModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ start_time: "", end_time: "" })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(form)
    setForm({ start_time: "", end_time: "" })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-lg font-bold mb-4">Add Timeslot</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input name="start_time" type="time" value={form.start_time} onChange={handleChange} placeholder="Start Time" required />
          <Input name="end_time" type="time" value={form.end_time} onChange={handleChange} placeholder="End Time" required />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
