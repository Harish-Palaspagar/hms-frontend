import { ActionIcon, Avatar, Badge, Text } from "@mantine/core";
import React from "react";
import {
  IconCalendar,
  IconNotes,
  IconStethoscope,
  IconTrash,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { formatDateTime } from "../../../Utility/DateUtility";

interface ApCardProps {
  id: number;
  doctorName: string;
  doctorId: number;
  notes?: string;
  reason: string;
  status: string;
  appointmentTime: string;
  onDelete?: (id: number) => void;
}

const ApCard = ({
  id,
  doctorName,
  doctorId,
  notes,
  reason,
  status,
  appointmentTime,
  onDelete,
}: ApCardProps) => {
  const formatAppointmentDateTime = (dateString: string) => {
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

  const handleDelete = () => {
    modals.openConfirmModal({
      title: (
        <span className="text-lg font-semibold">
          Do you want to cancel this appointment?
        </span>
      ),
      children: (
        <Text size="sm">
          Are you sure you want to cancel your appointment with Dr.{" "}
          {doctorName} scheduled on {formatDateTime(appointmentTime)}?
          <br />
          <br />
          The doctor will be notified about this cancellation. This action
          cannot be undone.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (onDelete) {
          onDelete(id);
        }
      },
    });
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-200 mb-4">
      <div className="flex items-start justify-between p-5">
        <div className="flex items-center gap-4">
          <Avatar name={doctorName} size="lg" radius="xl" color="red" />
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {doctorName}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge color={getStatusColor(status)} variant="light" size="lg">
            {status}
          </Badge>

          {status !== "CANCELLED" && status !== "COMPLETED" && (
            <ActionIcon
              color="red"
              variant="light"
              onClick={handleDelete}
              title="Cancel Appointment"
            >
              <IconTrash size={18} />
            </ActionIcon>
          )}
        </div>
      </div>

      <div className="h-px bg-neutral-200" />

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <IconCalendar className="w-5 h-5 text-neutral-500" />
          <div>
            <div className="text-xs text-neutral-500 font-medium">Date & Time</div>
            <div className="text-sm text-neutral-800 font-semibold">
              {formatAppointmentDateTime(appointmentTime)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <IconStethoscope className="w-5 h-5 text-neutral-500" />
          <div>
            <div className="text-xs text-neutral-500 font-medium">Reason</div>
            <div className="text-sm text-neutral-800 font-semibold">{reason}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <IconNotes className="w-5 h-5 text-neutral-500" />
          <div>
            <div className="text-xs text-neutral-500 font-medium">Notes</div>
            <div className="text-sm text-neutral-800 font-semibold">
              {notes ? notes : "No notes"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApCard;