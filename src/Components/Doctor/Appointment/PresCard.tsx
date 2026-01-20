import { Avatar, Badge, ActionIcon, Group } from "@mantine/core";
import React from "react";
import {
  IconCalendar,
  IconNotes,
  IconUser,
  IconPill,
  IconEye,
  IconMedicineSyrup,
} from "@tabler/icons-react";

const PresCard = ({
  doctorName,
  notes,
  status,
  prescriptionDate,
  medicines,
  onView,
  onMed,
}: any) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    if (status === "SCHEDULED") return "blue";
    if (status === "COMPLETED") return "green";
    if (status === "CANCELLED") return "red";
    return "gray";
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-200 mb-4">
      {/* Top */}
      <div className="flex items-start justify-between p-5">
        <div className="flex items-center gap-4">
          <Avatar name={doctorName} size="lg" radius="xl" color="red" />
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {doctorName}
            </h3>
            <div className="text-sm text-neutral-500 flex items-center gap-2">
              <IconUser className="w-4 h-4" />
              Doctor
            </div>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-200" />

      {/* Body */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <IconCalendar className="w-5 h-5 text-neutral-500" />
          <div>
            <div className="text-xs text-neutral-500">Prescription Date</div>
            <div className="text-sm text-neutral-800 font-medium">
              {formatDateTime(prescriptionDate)}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <IconNotes className="w-5 h-5 text-neutral-500 mt-1" />
          <div>
            <div className="text-xs text-neutral-500">Notes</div>
            <div className="text-sm text-neutral-800 font-medium">
              {notes ? notes : "No notes"}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
          <ActionIcon onClick={onView} color="neutral.6">
            <IconEye size={18} />
          </ActionIcon>

          <ActionIcon onClick={onMed} color="primary.5">
            <IconMedicineSyrup size={18} />
          </ActionIcon>
        </div>
      </div>
    </div>
  );
};

export default PresCard;
