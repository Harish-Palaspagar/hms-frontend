import React, { useEffect, useState } from "react";
import { ScrollArea, Badge } from "@mantine/core";
import { IconPill } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { getAllMedicinesByPatientId } from "../../../Services/AppointmentService";
import { medicineFrequencies } from "../../../Data/DropdownData";


const Medications = () => {
  const user = useSelector((state: any) => state.user);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.profileId) return;

    getAllMedicinesByPatientId(user.profileId)
      .then((response) => {
        setData(Array.isArray(response) ? response : [response]);
      })
      .catch(console.error);
  }, [user?.profileId]);

  const card = (medicine: any, index: number) => {
    // 🔥 map + find label
    const freqLabel =
      medicineFrequencies.find((f) => f.value === medicine.frequency)?.label ||
      medicine.frequency;

    return (
      <div
        key={index}
        className="mb-3 rounded-2xl border border-cyan-200 bg-white p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
              <IconPill size={20} className="text-cyan-600" />
            </div>

            <div>
              <p className="text-base font-semibold text-gray-900">
                {medicine.name}
              </p>

              <p className="mt-1 text-sm text-gray-600">
                {freqLabel}
              </p>
            </div>
          </div>

          <Badge variant="light" color="cyan" size="md">
            {medicine.dosage}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col gap-4 rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-teal-50 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Patient Medications
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {data.length} prescribed medicines
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 shadow-md">
          <IconPill size={20} className="text-white" />
        </div>
      </div>

      <ScrollArea.Autosize mah={400} className="w-full">
        <div className="pr-2">
          {data.map((medicine, index) => card(medicine, index))}
        </div>
      </ScrollArea.Autosize>
    </div>
  );
};

export default Medications;
