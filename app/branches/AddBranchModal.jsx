import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AddBranchModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", address: "", contact: "" })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(form)
    setForm({ name: "", address: "", contact: "" })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-lg font-bold mb-4">Add Branch</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Branch Name" required />
          <Input name="address" value={form.address} onChange={handleChange} placeholder="Branch Address" required />
          <Input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact Number" required />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
