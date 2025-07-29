"use client";
import React, { useState } from "react";
import AddPromotionModal from "./AddPromotionModal";
import DeletePromotionModal from "./DeletePromotionModal";
import PromotionsTable from "./PromotionsTable";
import { Button } from "@/components/ui/button";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([
    { type: "Percentage", code: "SUMMER25", value: "25", max_discount: "1000", min_amount: "2000", start_date: "2025-07-01", end_date: "2025-07-31" },
    { type: "Flat", code: "FLAT500", value: "500", max_discount: "500", min_amount: "1000", start_date: "2025-08-01", end_date: "2025-08-15" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleAdd = (promo) => setPromotions([ ...promotions, promo ]);
  const handleDelete = (promo) => setPromotions(promotions.filter(p => p !== promo));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Promotions</h1>
        <Button onClick={() => setShowAdd(true)}>Add New Promotion</Button>
      </div>
      <PromotionsTable promotions={promotions} onDelete={p => setDeleteTarget(p)} />
      {showAdd && (
        <AddPromotionModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />
      )}
      {deleteTarget && (
        <DeletePromotionModal promotion={deleteTarget} onDelete={handleDelete} onClose={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
