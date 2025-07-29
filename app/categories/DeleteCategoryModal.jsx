import React from "react"
import { Button } from "@/components/ui/button"

export default function DeleteCategoryModal({ open, onClose, onDelete, category }) {
  if (!open || !category) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-lg font-bold mb-4">Delete Category</h2>
        <p>Are you sure you want to delete <span className="font-semibold">{category.name}</span>?</p>
        <div className="flex gap-2 justify-end mt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" variant="destructive" onClick={() => { onDelete(category.id); onClose(); }}>Delete</Button>
        </div>
      </div>
    </div>
  )
}
