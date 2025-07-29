"use client"
import React, { useState } from "react"
import { useGetServicesQuery, useCreateServiceMutation, useUpdateServiceMutation, usePatchServiceMutation, useDeleteServiceMutation } from "@/redux/features/servicesApi"
import { useGetCategoriesQuery } from "@/redux/features/categoriesApi"
import AddServiceModal from "./AddServiceModal"
import DeleteServiceModal from "./DeleteServiceModal"
import ServicesTable from "./ServicesTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ServicesPage() {
  const { data: services = [], isLoading } = useGetServicesQuery()
  const { data: categories = [] } = useGetCategoriesQuery()
  const [createService] = useCreateServiceMutation()
  const [updateService] = useUpdateServiceMutation()
  const [patchService] = usePatchServiceMutation()
  const [deleteService] = useDeleteServiceMutation()

  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    category_id: "",
    active: true
  })
  const [editId, setEditId] = useState(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    })
  }

  const handleAdd = async (service) => {
    await createService(service)
  }

  const handleEdit = (service) => {
    setForm({
      name: service.name || "",
      description: service.description || "",
      duration: service.duration || "",
      price: service.price || "",
      category_id: service.category_id || "",
      active: service.active !== undefined ? service.active : true
    })
    setEditId(service.id)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (editId) {
      await updateService({ id: editId, ...form })
      setEditId(null)
      setForm({
        name: "",
        description: "",
        duration: "",
        price: "",
        category_id: "",
        active: true
      })
    }
  }

  const handlePatch = async (service) => {
    await patchService({ id: service.id, name: service.name + " (patched)", category_id: service.category_id })
  }

  const handleDelete = async (id) => {
    await deleteService(id)
    setDeleteModalOpen(false)
    setSelectedService(null)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Services Management</h1>
      <div className="mb-6 flex gap-2">
        <Button onClick={() => setAddModalOpen(true)}>Add Service</Button>
        {editId && (
          <form onSubmit={handleUpdate} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Service Name" required />
              <select name="category_id" value={form.category_id} onChange={handleChange} required className="border rounded px-2 py-1">
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
              <Input name="duration" type="number" value={form.duration} onChange={handleChange} placeholder="Duration (minutes)" required />
              <Input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Price" required />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1">
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                Active
              </label>
            </div>
            <Button type="submit">Update</Button>
            <Button type="button" variant="outline" onClick={() => { setEditId(null); setForm({ name: "", description: "", duration: "", price: "", category_id: "", active: true }) }}>Cancel</Button>
          </form>
        )}
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ServicesTable
          services={services}
          categories={categories}
          onEdit={handleEdit}
          onPatch={handlePatch}
          onDelete={(service) => { setSelectedService(service); setDeleteModalOpen(true) }}
        />
      )}
      <AddServiceModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAdd}
        categories={categories}
      />
      <DeleteServiceModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        service={selectedService}
      />
    </div>
  )
}
