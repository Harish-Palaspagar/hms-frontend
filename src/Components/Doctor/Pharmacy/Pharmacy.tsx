import React, { useEffect, useState } from "react";
import { ScrollArea, Badge } from "@mantine/core";
import { IconPill, IconCheck, IconAlertCircle, IconPackage } from "@tabler/icons-react";
import { getAllMedicines } from "../../../Services/MedicineService";
import { errorNotification } from "../../../Utility/Notifications";

const Pharmacy = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMedicines()
      .then((res) => {
        setMedicines(Array.isArray(res) ? res : []);
      })
      .catch(() =>
        errorNotification("Failed to load pharmacy medicines")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full h-full p-4 sm:p-5 md:p-6 border border-red-200 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-50 via-rose-50 to-red-50 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
            Pharmacy
          </h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            {medicines.length} medicine{medicines.length !== 1 ? 's' : ''} available for prescription
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg self-start sm:self-auto">
          <IconPackage size={22} className="text-white" />
        </div>
      </div>

      {/* Body */}
      <ScrollArea.Autosize mah={460} mx="auto" className="w-full">
        <div className="pr-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
              <div className="text-center text-gray-500 font-medium">Loading medicines...</div>
            </div>
          ) : medicines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <IconPill size={32} className="text-red-400" />
              </div>
              <div className="text-center text-gray-500 font-medium">No medicines found</div>
            </div>
          ) : (
            <div className="space-y-3">
              {medicines.map((med, index) => {
                const lowStock = med.stock <= 200;

                return (
                  <div
                    key={med.id ?? index}
                    className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border border-red-200 bg-white shadow-sm hover:shadow-lg hover:border-red-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    {/* Icon */}
                    <div className="flex h-12 w-12 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 flex-shrink-0 shadow-sm">
                      <IconPill size={22} className="text-red-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 w-full min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-base sm:text-sm">
                            <span className="block sm:inline truncate">{med.name}</span>{" "}
                            <span className="text-gray-500 text-sm block sm:inline mt-1 sm:mt-0">
                              ({med.dosage})
                            </span>
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {med.manufacturer}
                          </p>
                        </div>

                        <Badge
                          variant="light"
                          color={lowStock ? "red" : "green"}
                          className="text-xs font-medium shadow-sm self-start"
                        >
                          {lowStock ? (
                            <span className="flex items-center gap-1">
                              <IconAlertCircle size={14} />
                              Limited Stock
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <IconCheck size={14} />
                              Available
                            </span>
                          )}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                            <IconPackage size={14} className="text-red-500" />
                          </div>
                          <span className="font-medium">Stock</span>
                        </div>
                        <div className={`text-sm font-bold px-3 py-1.5 rounded-lg ${
                          lowStock 
                            ? 'text-red-600 bg-red-50' 
                            : 'text-green-600 bg-green-50'
                        }`}>
                          {med.stock} units
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea.Autosize>
    </div>
  );
};

export default Pharmacy;