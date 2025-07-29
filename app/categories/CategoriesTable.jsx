import React from "react"
import { Button } from "@/components/ui/button"

export default function CategoriesTable({ categories, onEdit, onPatch, onDelete }) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">ID</th>
          <th className="p-2">Name</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.id} className="border-t">
            <td className="p-2">{category.id}</td>
            <td className="p-2">{category.name}</td>
            <td className="p-2 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(category)}>
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => onPatch(category)}>
                Patch
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(category)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
