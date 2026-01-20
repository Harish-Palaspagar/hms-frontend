import React, { useEffect, useState } from "react";
import { ScrollArea, Badge } from "@mantine/core";
import {
  IconPill,
  IconBuilding,
  IconPackage,
  IconMedicineSyrup,
} from "@tabler/icons-react";
import { getAllMedicines } from "../../../Services/MedicineService";
import { errorNotification } from "../../../Utility/Notifications";

const Medicines = () => {
  const [medicine, setMedicine] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMedicines()
      .then((res) => {
        console.log("Medicines API:", res);
        setMedicine(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage || "Failed to fetch medicines"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const card = (med: any, index: number) => {
    const isLowStock = med.stock === 0 || med.stock < 200;

    return (
      <div
        key={med.id ?? index}
        className="p-4 mb-3 border border-blue-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <IconPill size={20} className="text-blue-600" />
            </div>

            <div>
              <div className="font-semibold text-gray-800">
                {med.name} ({med.dosage})
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <IconBuilding size={12} />
                {med.manufacturer}
              </div>
            </div>
          </div>

          <Badge
            variant="light"
            color={isLowStock ? "red" : "teal"}
            size="sm"
          >
            {isLowStock ? "Low Stock" : "In Stock"}
          </Badge>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IconPackage size={16} className="text-blue-500" />
            <span className="font-medium">Stock</span>
          </div>

          <div
            className={`text-sm font-bold ${
              isLowStock ? "text-red-600" : "text-teal-600"
            } bg-gray-50 px-3 py-1 rounded-md`}
          >
            {med.stock} units
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-5 border border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-gray-800">
            Medicines Inventory
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {medicine.length} medicines available
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
          <IconMedicineSyrup size={20} className="text-white" />
        </div>
      </div>

      {/* Body */}
      <ScrollArea.Autosize mah={400} className="w-full">
        <div className="pr-2">
          {loading ? (
            <div className="text-center text-gray-500 py-6">
              Loading medicines...
            </div>
          ) : medicine.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No medicines available
            </div>
          ) : (
            medicine.map((med, index) => card(med, index))
          )}
        </div>
      </ScrollArea.Autosize>
    </div>
  );
};

export default Medicines;
