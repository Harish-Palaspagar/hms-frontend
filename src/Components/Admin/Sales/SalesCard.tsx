import React from "react";
import { Badge, Button } from "@mantine/core";

interface SalesCardProps {
  sale: any;
  medicineMap: Record<string, any>;
  onDetails: (row: any) => void;
}

const SalesCard = ({ sale, medicineMap, onDetails }: SalesCardProps) => {
  const hasExpiredMedicine = sale.saleItems?.some((item: any) => {
    const med = medicineMap[String(item.medicineId)];
    return med && new Date(med.expirationDate) < new Date();
  });

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            {sale.buyerName}
          </h3>
          <p className="text-sm text-neutral-500">
            {sale.buyerContact}
          </p>
        </div>

        <Badge color={hasExpiredMedicine ? "red" : "green"} variant="light">
          {hasExpiredMedicine ? "EXPIRED" : "AVAILABLE"}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-neutral-500">Sale Date</span>
          <span className="font-semibold">{sale.saleDate}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-500">Total Amount</span>
          <span className="font-semibold">₹{sale.amount}</span>
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <Button size="xs" variant="outline" onClick={() => onDetails(sale)}>
          View Details
        </Button>
      </div>
    </div>
  );
};

export default SalesCard;
