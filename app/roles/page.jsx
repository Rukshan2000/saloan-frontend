"use client"
import React, { useState } from "react"
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  usePatchRoleMutation,
  useDeleteRoleMutation,
} from "@/redux/features/rolesApi"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RolesPage() {
  const { data: roles = [], isLoading } = useGetRolesQuery()
  const [createRole] = useCreateRoleMutation()
  const [updateRole] = useUpdateRoleMutation()
  const [patchRole] = usePatchRoleMutation()
  const [deleteRole] = useDeleteRoleMutation()

  const [form, setForm] = useState({ name: "" })
  const [editId, setEditId] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editId) {
      await updateRole({ id: editId, ...form })
      setEditId(null)
    } else {
      await createRole(form)
    }
    setForm({ name: "" })
  }

  const handleEdit = (role) => {
    setForm({ name: role.name })
    setEditId(role.id)
  }

  const handlePatch = async (role) => {
    await patchRole({ id: role.id, name: role.name + " (patched)" })
  }

  const handleDelete = async (id) => {
    await deleteRole(id)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Roles CRUD</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Role Name"
          required
        />
        <Button type="submit">{editId ? "Update" : "Create"}</Button>
      </form>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-t">
                <td className="p-2">{role.id}</td>
                <td className="p-2">{role.name}</td>
                <td className="p-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(role)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handlePatch(role)}>
                    Patch
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(role.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
