import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AddCategoryModal({ open, onClose, onAdd }) {
  const [name, setName] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({ name })
    setName("")
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-lg font-bold mb-4">Add Category</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Category Name"
            required
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
