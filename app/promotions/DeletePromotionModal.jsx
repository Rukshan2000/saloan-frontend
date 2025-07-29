import React from "react";
import { Button } from "@/components/ui/button";

export default function DeletePromotionModal({ onDelete, onClose, promotion }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-bold mb-4">Delete Promotion</h2>
        <p className="mb-6">Are you sure you want to delete the promotion <span className="font-semibold">{promotion.code}</span>?</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onDelete(promotion); onClose(); }}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
