import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AddServiceModal({ open, onClose, onAdd, categories }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    category_id: "",
    active: true
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(form)
    setForm({
      name: "",
      description: "",
      duration: "",
      price: "",
      category_id: "",
      active: true
    })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-4">Add Service</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Service Name" required />
          <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          <Input name="duration" type="number" value={form.duration} onChange={handleChange} placeholder="Duration (minutes)" required />
          <Input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Price" required />
          <select name="category_id" value={form.category_id} onChange={handleChange} required className="border rounded px-2 py-1">
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
            Active
          </label>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
