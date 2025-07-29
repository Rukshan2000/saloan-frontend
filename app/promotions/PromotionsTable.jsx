import React from "react";

export default function PromotionsTable({ promotions, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow border">
        <thead>
          <tr className="bg-orange-50">
            <th className="py-3 px-4 text-left">Type</th>
            <th className="py-3 px-4 text-left">Code</th>
            <th className="py-3 px-4 text-left">Value</th>
            <th className="py-3 px-4 text-left">Max Discount</th>
            <th className="py-3 px-4 text-left">Min Amount</th>
            <th className="py-3 px-4 text-left">Start Date</th>
            <th className="py-3 px-4 text-left">End Date</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-6 text-gray-400">No promotions found.</td>
            </tr>
          ) : (
            promotions.map((p, i) => (
              <tr key={i} className="border-t hover:bg-orange-50/40">
                <td className="py-2 px-4">{p.type}</td>
                <td className="py-2 px-4">{p.code}</td>
                <td className="py-2 px-4">{p.value}</td>
                <td className="py-2 px-4">{p.max_discount}</td>
                <td className="py-2 px-4">{p.min_amount}</td>
                <td className="py-2 px-4">{p.start_date}</td>
                <td className="py-2 px-4">{p.end_date}</td>
                <td className="py-2 px-4">
                  <button onClick={() => onDelete(p)} className="text-red-500 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
