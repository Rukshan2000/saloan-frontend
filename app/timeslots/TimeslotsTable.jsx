import React from "react"
import { Button } from "@/components/ui/button"

export default function TimeslotsTable({ timeSlots, onEdit, onPatch, onDelete }) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">ID</th>
          <th className="p-2">Start Time</th>
          <th className="p-2">End Time</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((slot) => (
          <tr key={slot.id} className="border-t">
            <td className="p-2">{slot.id}</td>
            <td className="p-2">{slot.start_time}</td>
            <td className="p-2">{slot.end_time}</td>
            <td className="p-2 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(slot)}>
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => onPatch(slot)}>
                Patch
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(slot)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
