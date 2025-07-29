import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddPromotionModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    type: "",
    code: "",
    value: "",
    max_discount: "",
    min_amount: "",
    start_date: "",
    end_date: "",
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
        <h2 className="text-xl font-bold mb-4">Add New Promotion</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="type" value={form.type} onChange={handleChange} placeholder="Type" className="w-full border rounded px-3 py-2" required />
          <input name="code" value={form.code} onChange={handleChange} placeholder="Code" className="w-full border rounded px-3 py-2" required />
          <input name="value" value={form.value} onChange={handleChange} placeholder="Value" className="w-full border rounded px-3 py-2" required />
          <input name="max_discount" value={form.max_discount} onChange={handleChange} placeholder="Max Discount" className="w-full border rounded px-3 py-2" required />
          <input name="min_amount" value={form.min_amount} onChange={handleChange} placeholder="Min Amount" className="w-full border rounded px-3 py-2" required />
          <input name="start_date" type="date" value={form.start_date} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          <input name="end_date" type="date" value={form.end_date} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
