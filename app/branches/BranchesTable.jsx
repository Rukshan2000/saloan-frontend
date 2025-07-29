import React from "react"
import { Button } from "@/components/ui/button"

export default function BranchesTable({ branches, onEdit, onPatch, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {branches.map((branch) => (
        <div key={branch.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">ID: {branch.id}</span>
          </div>
          <div className="text-lg font-semibold text-black">{branch.name}</div>
          <div className="text-sm text-gray-600 mb-2">{branch.address}</div>
          <div className="flex gap-2 mt-auto">
            <Button size="sm" variant="outline" onClick={() => onEdit(branch)}>
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={() => onPatch(branch)}>
              Patch
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(branch)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
