import { ActionIcon, Badge } from "@mantine/core";
import { IconEdit, IconCalendar } from "@tabler/icons-react";

interface InventoryCardProps {
  stock: any;
  medicineMap: Record<string, any>;
  onEdit: (row: any) => void;
}

const InventoryCard = ({ stock, medicineMap, onEdit }: InventoryCardProps) => {
  const med = medicineMap[String(stock.medicineId)];

  const getStatus = () => {
    const isExpired = new Date(stock.expirationDate) < new Date();
    if (isExpired) return { label: "EXPIRED", color: "red" };
    if (stock.quantity <= 0) return { label: "OUT OF STOCK", color: "red" };
    if (stock.quantity <= 10) return { label: "LOW STOCK", color: "yellow" };
    return { label: "AVAILABLE", color: "green" };
  };

  const status = getStatus();

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all p-5">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            {med?.name || "Unknown Medicine"}
          </h3>
          <p className="text-sm text-neutral-500">
            {med?.manufacturer || "Unknown Manufacturer"}
          </p>
        </div>

        <Badge color={status.color} variant="light">
          {status.label}
        </Badge>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Batch Number</span>
          <span className="font-semibold">{stock.batchNumber}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-500">Quantity</span>
          <span className="font-semibold">{stock.quantity}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 text-neutral-500">
            <IconCalendar size={14} />
            Expiry Date
          </span>
          <span className="font-semibold">{stock.expirationDate}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-5">
        <ActionIcon
          variant="light"
          color="blue"
          onClick={() => onEdit(stock)}
        >
          <IconEdit size={16} />
        </ActionIcon>
      </div>
    </div>
  );
};

export default InventoryCard;
