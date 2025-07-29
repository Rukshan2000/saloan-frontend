"use client"
import React, { useState } from "react"
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, usePatchCategoryMutation, useDeleteCategoryMutation } from "@/redux/features/categoriesApi"
import AddCategoryModal from "./AddCategoryModal"
import DeleteCategoryModal from "./DeleteCategoryModal"
import CategoriesTable from "./CategoriesTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CategoryPage() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery()
  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [patchCategory] = usePatchCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()

  const [form, setForm] = useState({ name: "" })
  const [editId, setEditId] = useState(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = async (category) => {
    await createCategory(category)
  }

  const handleEdit = (category) => {
    setForm({ name: category.name })
    setEditId(category.id)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (editId) {
      await updateCategory({ id: editId, ...form })
      setEditId(null)
      setForm({ name: "" })
    }
  }

  const handlePatch = async (category) => {
    await patchCategory({ id: category.id, name: category.name + " (patched)" })
  }

  const handleDelete = async (id) => {
    await deleteCategory(id)
    setDeleteModalOpen(false)
    setSelectedCategory(null)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Categories Management</h1>
      <div className="mb-6 flex gap-2">
        <Button onClick={() => setAddModalOpen(true)}>Add Category</Button>
        {editId && (
          <form onSubmit={handleUpdate} className="flex gap-2">
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Category Name"
              required
            />
            <Button type="submit">Update</Button>
            <Button type="button" variant="outline" onClick={() => { setEditId(null); setForm({ name: "" }) }}>Cancel</Button>
          </form>
        )}
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <CategoriesTable
          categories={categories}
          onEdit={handleEdit}
          onPatch={handlePatch}
          onDelete={(category) => { setSelectedCategory(category); setDeleteModalOpen(true) }}
        />
      )}
      <AddCategoryModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAdd}
      />
      <DeleteCategoryModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        category={selectedCategory}
      />
    </div>
  )
}
