import { Avatar, Badge } from "@mantine/core";
import {
  IconCalendar,
  IconNotes,
  IconStethoscope,
  IconUser,
} from "@tabler/icons-react";
import { formatDateTime } from "../../../Utility/DateUtility";

interface ReportCardProps {
  id: number;
  doctorName: string;
  diagnosis: string;
  notes?: string;
  createdAt: string;
}

const ReportCard = ({
  doctorName,
  diagnosis,
  notes,
  createdAt,
}: ReportCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all p-5">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <Avatar name={doctorName} size="lg" radius="xl" color="red" />
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {doctorName}
            </h3>
            <div className="text-sm text-neutral-500 flex items-center gap-1">
              <IconUser size={14} />
              Doctor
            </div>
          </div>
        </div>

        <Badge variant="light" color="green" size="lg">
          Report
        </Badge>
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-200 mb-4" />

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex gap-3">
          <IconCalendar className="text-gray-500" />
          <div>
            <div className="text-xs text-gray-500 font-medium">
              Report Date
            </div>
            <div className="text-sm font-semibold">
              {formatDateTime(createdAt)}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <IconStethoscope className="text-gray-500" />
          <div>
            <div className="text-xs text-gray-500 font-medium">
              Diagnosis
            </div>
            <div className="text-sm font-semibold">{diagnosis}</div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-4">
        <div className="text-xs text-gray-500 font-medium mb-1">
          Notes
        </div>
        <div className="text-sm font-semibold text-neutral-800">
          {notes || "No notes provided"}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
