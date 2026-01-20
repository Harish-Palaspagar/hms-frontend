import React, { useEffect, useState } from "react";
import { ScrollArea, Badge } from "@mantine/core";
import {
  IconUser,
  IconMapPin,
  IconDroplet,
  IconUsers,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { getAllPatients } from "../../../Services/PatientProfileService";

const Patient = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPatients()
      .then((response) => {
        console.log("patient response", response);
        setPatients(Array.isArray(response) ? response : []);
      })
      .catch((error) => {
        console.error("There was an error fetching the patients!", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const getBloodGroupColor = (bloodGroup?: string) => {
    if (!bloodGroup) return "gray";
    if (bloodGroup.includes("O")) return "red";
    if (bloodGroup.includes("A")) return "blue";
    if (bloodGroup.includes("B")) return "green";
    return "violet";
  };

  const getAge = (birthDate?: string | null) => {
    if (!birthDate) return "—";
    const dob = new Date(birthDate);
    const diff = Date.now() - dob.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  };

  const card = (patient: any, index: number) => {
    return (
      <div
        key={patient.id ?? index}
        className="p-4 mb-3 border border-pink-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-pink-300 transition-all duration-300 cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <IconUser size={20} className="text-pink-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                {patient.name}
              </div>

              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <IconMail size={12} />
                {patient.email}
              </div>

              {patient.phoneNumber && (
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <IconPhone size={12} />
                  {patient.phoneNumber}
                </div>
              )}
            </div>
          </div>

          <Badge
            variant="light"
            color={getBloodGroupColor(patient.bloodGroup)}
            size="sm"
          >
            {patient.bloodGroup || "N/A"}
          </Badge>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IconDroplet size={16} className="text-pink-500" />
            <span className="font-medium">Age</span>
          </div>
          <div className="text-sm font-bold text-pink-600 bg-gray-50 px-3 py-1 rounded-md">
            {getAge(patient.birthDate)} years
          </div>
        </div>

        {patient.address && (
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <IconMapPin size={12} />
            {patient.address}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-5 border border-pink-200 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-gray-800">
            Patients Directory
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {patients.length} registered patients
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center shadow-md">
          <IconUsers size={20} className="text-white" />
        </div>
      </div>

      {/* Body */}
      <ScrollArea.Autosize mah={400} className="w-full">
        <div className="pr-2">
          {loading ? (
            <div className="text-center text-gray-500 py-6">
              Loading patients...
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No patients found
            </div>
          ) : (
            patients.map((patient, index) => card(patient, index))
          )}
        </div>
      </ScrollArea.Autosize>
    </div>
  );
};

export default Patient;
