import React from "react";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border border-gray-100">
          <div className="text-2xl font-semibold text-gray-700 mb-2">Total Users</div>
          <div className="text-3xl font-bold text-blue-600 mb-1">1240</div>
          <div className="text-gray-500 text-sm">Active users registered on the platform.</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border border-gray-100">
          <div className="text-2xl font-semibold text-gray-700 mb-2">Bookings Today</div>
          <div className="text-3xl font-bold text-green-600 mb-1">32</div>
          <div className="text-gray-500 text-sm">Number of bookings made today.</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border border-gray-100">
          <div className="text-2xl font-semibold text-gray-700 mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-yellow-600 mb-1">$4,500</div>
          <div className="text-gray-500 text-sm">Revenue generated this month.</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border border-gray-100">
          <div className="text-2xl font-semibold text-gray-700 mb-2">Services Offered</div>
          <div className="text-3xl font-bold text-purple-600 mb-1">18</div>
          <div className="text-gray-500 text-sm">Different services available.</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border border-gray-100">
          <div className="text-2xl font-semibold text-gray-700 mb-2">Branches</div>
          <div className="text-3xl font-bold text-pink-600 mb-1">5</div>
          <div className="text-gray-500 text-sm">Active branches in the network.</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border border-gray-100">
          <div className="text-2xl font-semibold text-gray-700 mb-2">Pending Approvals</div>
          <div className="text-3xl font-bold text-red-600 mb-1">7</div>
          <div className="text-gray-500 text-sm">Bookings or users pending approval.</div>
        </div>
      </div>
    </div>
  );
}
