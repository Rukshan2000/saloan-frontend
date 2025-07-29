import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddAppointmentModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    customer: "",
    date: "",
    time: "",
    service: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="customer" value={form.customer} onChange={handleChange} placeholder="Customer Name" className="w-full border rounded px-3 py-2" required />
          <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          <input name="time" type="time" value={form.time} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          <input name="service" value={form.service} onChange={handleChange} placeholder="Service" className="w-full border rounded px-3 py-2" required />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
