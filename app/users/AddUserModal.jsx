import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddUserModal({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
  roles,
  branches = [], // default to empty array if not provided
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold mb-6 text-gray-800 text-center">Add New User</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Full Name"
            required
            className="rounded-lg border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
          />
          <Input
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email Address"
            required
            className="rounded-lg border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
          />
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Password"
            required
            className="rounded-lg border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
          />
          <select
            name="role_id"
            value={form.role_id}
            onChange={onChange}
            required
            className="rounded-lg border-gray-300 px-3 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm bg-gray-50"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <select
            name="branch_id"
            value={form.branch_id}
            onChange={onChange}
            required
            className="rounded-lg border-gray-300 px-3 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm bg-gray-50"
          >
            <option value="">Select Branch</option>
            {branches && branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <div className="flex gap-3 mt-4 justify-end">
            <Button type="submit" className="rounded-lg bg-black hover:bg-gray-900 text-white font-semibold px-6 py-2 shadow transition-all">
              Add
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="rounded-lg border-gray-300 px-6 py-2 hover:bg-gray-100 transition-all">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
