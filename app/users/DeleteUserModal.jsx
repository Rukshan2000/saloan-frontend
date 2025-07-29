import React from "react"
import { Button } from "@/components/ui/button"

export default function DeleteUserModal({ open, onClose, onDelete, user }) {
  if (!open || !user) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-bold mb-4">Delete User</h2>
        <p className="mb-4">Are you sure you want to delete <span className="font-semibold">{user.name}</span>?</p>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={() => onDelete(user.id)}>Delete</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}
