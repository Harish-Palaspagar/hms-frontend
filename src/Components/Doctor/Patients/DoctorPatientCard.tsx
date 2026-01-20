import { Avatar, Badge } from "@mantine/core";
import { IconMail, IconPhone, IconUser } from "@tabler/icons-react";

interface DoctorPatientCardProps {
  patientName: string;
  email?: string;
  phoneNumber?: string;
  appointmentCount: number;
}

const DoctorPatientCard = ({
  patientName,
  email,
  phoneNumber,
  appointmentCount,
}: DoctorPatientCardProps) => {
  return (
    <div className="relative mb-4 rounded-2xl border border-red-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      
      {/* Visits Badge (Top Right) */}
      <div className="absolute right-4 top-4">
        <Badge color="red" variant="light" radius="md" className="font-semibold">
          {appointmentCount} Visits
        </Badge>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-red-50" />
          <Avatar name={patientName} size="lg" radius="xl" color="red" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {patientName}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1">
              <IconUser size={14} className="text-red-500" />
              Patient
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-red-100" />

      {/* Contact Info */}
      <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <IconMail size={16} className="text-red-400" />
          <span className="font-medium">{email || "Not Provided"}</span>
        </div>

        <div className="flex items-center gap-2">
          <IconPhone size={16} className="text-red-400" />
          <span className="font-medium">{phoneNumber || "Not Provided"}</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatientCard;
