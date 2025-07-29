"use client"
import React, { useState } from "react"
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  usePatchUserMutation,
  useDeleteUserMutation,
} from "@/redux/features/usersApi"
import { useGetRolesQuery } from "@/redux/features/rolesApi"

import AddUserModal from "./AddUserModal"
import DeleteUserModal from "./DeleteUserModal"
import UsersTable from "./UsersTable"
import { useGetBranchesQuery } from "@/redux/features/branchesApi"

function UsersPage() {
  const { data: users = [], isLoading } = useGetUsersQuery()
  const [createUser] = useCreateUserMutation()
  const [updateUser] = useUpdateUserMutation()
  const [patchUser] = usePatchUserMutation()
  const [deleteUser] = useDeleteUserMutation()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
    branch_id: ""
  })
  const { data: roles = [] } = useGetRolesQuery()
  const { data: branches = [] } = useGetBranchesQuery()
  const [editId, setEditId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editId) {
      await updateUser({ id: editId, ...form })
      setEditId(null)
    } else {
      await createUser(form)
    }
    setForm({ name: "", email: "", password: "", role_id: "", branch_id: "" })
    setShowAddModal(false)
  }

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role_id: user.role_id || "",
      branch_id: user.branch_id || ""
    })
    setEditId(user.id)
    setShowAddModal(true)
  }

  const handlePatch = async (user) => {
    await patchUser({ id: user.id, name: user.name + " (patched)" })
  }

  const handleDelete = async (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const confirmDelete = async (id) => {
    await deleteUser(id)
    setShowDeleteModal(false)
    setSelectedUser(null)
  }

  const handleAdd = () => {
    setForm({ name: "", email: "", password: "", role_id: "", branch_id: "" })
    setEditId(null)
    setShowAddModal(true)
  }

  return (
    <div className="w-full p-6">
      <UsersTable
        users={users}
        onEdit={handleEdit}
        onPatch={handlePatch}
        onDelete={handleDelete}
        onAdd={handleAdd}
        roles={roles}
      />
      <AddUserModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        roles={roles}
        branches={branches}
      />
      <DeleteUserModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={confirmDelete}
        user={selectedUser}
      />
    </div>
  )
}

export default UsersPage
