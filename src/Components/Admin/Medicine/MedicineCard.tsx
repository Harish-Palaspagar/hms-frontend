import { ActionIcon, Badge } from "@mantine/core";
import {
  IconEdit,
  IconMedicineSyrup,
  IconCurrencyRupee,
} from "@tabler/icons-react";
import capitalizeFirstLetter from "../../../Utility/Capitalise";

interface MedicineCardProps {
  medicine: any;
  onEdit: (medicine: any) => void;
}

const MedicineCard = ({ medicine, onEdit }: MedicineCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all p-5">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <IconMedicineSyrup className="text-primary-500" />
          <h3 className="text-lg font-semibold text-neutral-900">
            {medicine.name}
          </h3>
        </div>

        <ActionIcon
          variant="light"
          color="primary"
          onClick={() => onEdit(medicine)}
        >
          <IconEdit size={16} />
        </ActionIcon>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <Badge variant="light">
          {capitalizeFirstLetter(medicine.category)}
        </Badge>
        <Badge variant="light" color="blue">
          {capitalizeFirstLetter(medicine.type)}
        </Badge>
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Dosage</span>
          <span className="font-semibold">{medicine.dosage}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-500">Manufacturer</span>
          <span className="font-semibold">{medicine.manufacturer}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-neutral-500">Price</span>
          <span className="font-semibold flex items-center gap-1">
            <IconCurrencyRupee size={16} />
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(medicine.unitPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
