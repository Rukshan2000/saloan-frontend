
import React from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"

export default function BeauticianAvailabilityTable({ availabilities, beauticians, onEdit, onDelete }) {
  // Get user from redux
  const user = useSelector((state) => state.auth.user);
  // Hide actions and add availability for beautician role (2)
  const isBeautician = user?.role === 2;
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">ID</th>
          <th className="p-2">Beautician</th>
          <th className="p-2">Day</th>
          <th className="p-2">Start Time</th>
          <th className="p-2">End Time</th>
          {!isBeautician && <th className="p-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {availabilities.map((item) => {
          const beautician = beauticians.find((b) => String(b.id) === String(item.beautician_id));
          // If beautician, only show actions for non-beautician users
          // If beautician, only show actions for their own availabilities
          const showActions = !isBeautician || (isBeautician && String(item.beautician_id) === String(user?.id));
          return (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.id}</td>
              <td className="p-2">{beautician ? beautician.name : `ID ${item.beautician_id}`}</td>
              <td className="p-2">{item.day_of_week}</td>
              <td className="p-2">{item.start_time}</td>
              <td className="p-2">{item.end_time}</td>
              {!isBeautician && (
                <td className="p-2 flex gap-2">
                  {showActions && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              )}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
