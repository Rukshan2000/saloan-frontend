import React from "react"
import { Button } from "@/components/ui/button"

export default function ServicesTable({ services, categories, onEdit, onPatch, onDelete }) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">ID</th>
          <th className="p-2">Name</th>
          <th className="p-2">Description</th>
          <th className="p-2">Duration</th>
          <th className="p-2">Price</th>
          <th className="p-2">Category</th>
          <th className="p-2">Active</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => {
          const category = categories.find((cat) => cat.id === service.category_id)
          return (
            <tr key={service.id} className="border-t">
              <td className="p-2">{service.id}</td>
              <td className="p-2">{service.name}</td>
              <td className="p-2">{service.description}</td>
              <td className="p-2">{service.duration}</td>
              <td className="p-2">{service.price}</td>
              <td className="p-2">{category ? category.name : service.category_id}</td>
              <td className="p-2">{service.active ? "Yes" : "No"}</td>
              <td className="p-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(service)}>
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => onPatch(service)}>
                  Patch
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(service)}>
                  Delete
                </Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
