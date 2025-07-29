import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AddBeauticianAvailabilityModal({ beauticians, onSubmit, initialForm, editId, onClose }) {
  const [form, setForm] = useState(initialForm || {
    beautician_id: "",
    day_of_week: "",
    start_time: "",
    end_time: ""
  })

  const handleChange = (e) => {
    let value = e.target.value
    if (e.target.name === "beautician_id") {
      value = value ? parseInt(value, 10) : ""
    }
    if (e.target.name === "start_time" || e.target.name === "end_time") {
      // Ensure time is in HH:MM:SS format
      if (value && value.length === 5) {
        value = value + ":00"
      }
    }
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
    setForm({ beautician_id: "", day_of_week: "", start_time: "", end_time: "" })
    if (onClose) onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{editId ? "Edit" : "Add"} Beautician Availability</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <select
            name="beautician_id"
            value={form.beautician_id}
            onChange={handleChange}
            required
            className="border rounded px-2 py-1"
          >
            <option value="">Select Beautician</option>
            {beauticians.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <select
            name="day_of_week"
            value={form.day_of_week}
            onChange={handleChange}
            required
            className="border rounded px-2 py-1"
          >
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
          <Input
            name="start_time"
            type="time"
            value={form.start_time}
            onChange={handleChange}
            placeholder="Start Time"
            required
          />
          <Input
            name="end_time"
            type="time"
            value={form.end_time}
            onChange={handleChange}
            placeholder="End Time"
            required
          />
          <div className="flex gap-2 mt-2">
            <Button type="submit">{editId ? "Update" : "Create"}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
