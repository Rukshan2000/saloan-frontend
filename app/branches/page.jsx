"use client"
import React, { useState } from "react"
import { useGetBranchesQuery, useCreateBranchMutation, useUpdateBranchMutation, usePatchBranchMutation, useDeleteBranchMutation } from "@/redux/features/branchesApi"
import AddBranchModal from "./AddBranchModal"
import DeleteBranchModal from "./DeleteBranchModal"
import BranchesTable from "./BranchesTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function BranchesPage() {
  const { data: branches = [], isLoading } = useGetBranchesQuery()
  const [createBranch] = useCreateBranchMutation()
  const [updateBranch] = useUpdateBranchMutation()
  const [patchBranch] = usePatchBranchMutation()
  const [deleteBranch] = useDeleteBranchMutation()

  const [form, setForm] = useState({ name: "", address: "", contact: "" })
  const [editId, setEditId] = useState(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = async (branch) => {
    await createBranch(branch)
  }

  const handleEdit = (branch) => {
    setForm({ name: branch.name, address: branch.address, contact: branch.contact })
    setEditId(branch.id)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (editId) {
      await updateBranch({ id: editId, ...form })
      setEditId(null)
      setForm({ name: "", address: "", contact: "" })
    }
  }

  const handlePatch = async (branch) => {
    await patchBranch({ id: branch.id, name: branch.name + " (patched)" })
  }

  const handleDelete = async (id) => {
    await deleteBranch(id)
    setDeleteModalOpen(false)
    setSelectedBranch(null)
  }

  return (
    <div className="max-w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Branches Management</h1>
      <div className="mb-6 flex gap-2">
        <Button onClick={() => setAddModalOpen(true)}>Add Branch</Button>
        {editId && (
          <form onSubmit={handleUpdate} className="flex gap-2">
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Branch Name" required />
            <Input name="address" value={form.address} onChange={handleChange} placeholder="Branch Address" required />
            <Input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact Number" required />
            <Button type="submit">Update</Button>
            <Button type="button" variant="outline" onClick={() => { setEditId(null); setForm({ name: "", address: "", contact: "" }) }}>Cancel</Button>
          </form>
        )}
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <BranchesTable
          branches={branches}
          onEdit={handleEdit}
          onPatch={handlePatch}
          onDelete={(branch) => { setSelectedBranch(branch); setDeleteModalOpen(true) }}
        />
      )}
      <AddBranchModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAdd}
      />
      <DeleteBranchModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        branch={selectedBranch}
      />
    </div>
  )
}
