import React, { useEffect, useState } from "react";
import { ScrollArea, Badge } from "@mantine/core";
import {
  IconStethoscope,
  IconMail,
  IconMapPin,
  IconBriefcase,
  IconUserCheck,
  IconPhone,
} from "@tabler/icons-react";
import { getAllDoctors } from "../../../Services/DoctorProfileService";

const Doctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDoctors()
      .then((response) => {
        console.log("doctor response", response);
        setDoctors(Array.isArray(response) ? response : []);
      })
      .catch((error) => {
        console.error("There was an error fetching the doctors!", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const card = (doctor: any, index: number) => {
    return (
      <div
        key={doctor.id ?? index}
        className="p-4 mb-3 border border-teal-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-300 cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <IconStethoscope size={20} className="text-teal-600" />
            </div>

            <div>
              <div className="font-semibold text-gray-800">
                {doctor.name}
              </div>

              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <IconMail size={12} />
                {doctor.email}
              </div>

              {doctor.phoneNumber && (
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <IconPhone size={12} />
                  {doctor.phoneNumber}
                </div>
              )}
            </div>
          </div>

          <Badge variant="light" color="teal" size="sm">
            {doctor.specialization}
          </Badge>
        </div>

        {/* Department */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IconBriefcase size={16} className="text-teal-500" />
            <span className="font-medium">Department</span>
          </div>
          <div className="text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-md font-medium">
            {doctor.department}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IconMapPin size={16} className="text-teal-500" />
            <span className="font-medium">Location</span>
          </div>
          <div className="text-sm font-bold text-teal-600 bg-gray-50 px-3 py-1 rounded-md">
            {doctor.address || "—"}
          </div>
        </div>

        {/* Experience */}
        <div className="mt-2 text-xs text-gray-500">
          Experience: <span className="font-semibold">{doctor.totalExperience} years</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-5 border border-teal-200 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-gray-800">
            Doctors Directory
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {doctors.length} doctors available
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center shadow-md">
          <IconUserCheck size={20} className="text-white" />
        </div>
      </div>

      {/* Body */}
      <ScrollArea.Autosize mah={400} className="w-full">
        <div className="pr-2">
          {loading ? (
            <div className="text-center text-gray-500 py-6">
              Loading doctors...
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No doctors found
            </div>
          ) : (
            doctors.map((doctor, index) => card(doctor, index))
          )}
        </div>
      </ScrollArea.Autosize>
    </div>
  );
};

export default Doctors;
