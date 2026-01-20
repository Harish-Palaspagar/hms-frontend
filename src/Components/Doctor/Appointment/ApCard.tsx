import { ActionIcon, Avatar, Badge, Text } from "@mantine/core";
import React from "react";
import {
  IconCalendar,
  IconNotes,
  IconUser,
  IconPhone,
  IconClock,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { formatDateTime } from "../../../Utility/DateUtility";
import { useNavigate } from "react-router";

interface ApCardProps {
  id: number;
  patientName: string;
  patientPhoneNumber: string;
  patientEmail: string;
  reason: string;
  notes?: string;
  status: string;
  appointmentTime: string;
  onDelete?: (rowData: any) => void;
}

const ApCard = ({
  id,
  patientName,
  patientPhoneNumber,
  patientEmail,
  reason,
  notes,
  status,
  appointmentTime,
  onDelete,
}: ApCardProps) => {
  const navigate = useNavigate();

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
        <Text fw={600} size="lg">
          Confirm Appointment Cancellation
        </Text>
      ),
      children: (
        <Text size="sm">
          Are you sure you want to cancel the appointment for patient{" "}
          <strong>{patientName}</strong> scheduled on{" "}
          <strong>{formatDateTime(appointmentTime)}</strong>?
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (onDelete) {
          onDelete({
            id,
            patientName,
            patientPhoneNumber,
            patientEmail,
            reason,
            notes,
            status,
            appointmentTime,
          });
        }
      },
    });
  };

  const handleView = () => {
    navigate(`${id}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 mb-5">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Avatar name={patientName} size="lg" radius="xl" color="red" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {patientName}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <IconUser className="w-4 h-4" />
              Patient
            </div>
          </div>
        </div>

        <Badge
          color={getStatusColor(status)}
          variant="light"
          size="md"
          radius="md"
        >
          {status}
        </Badge>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Content */}
      <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex gap-3">
          <IconCalendar className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500">Date & Time</div>
            <div className="text-sm font-semibold text-gray-800">
              {formatAppointmentDateTime(appointmentTime)}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <IconPhone className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500">Phone</div>
            <div className="text-sm font-semibold text-gray-800">
              {patientPhoneNumber}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <IconNotes className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500">Reason</div>
            <div className="text-sm font-semibold text-gray-800">
              {reason}
            </div>
          </div>
        </div>

        <div className="md:col-span-3 flex gap-3">
          <IconClock className="w-5 h-5 text-gray-500 mt-1" />
          <div>
            <div className="text-xs text-gray-500">Notes</div>
            <div className="text-sm font-semibold text-gray-800">
              {notes || "No notes"}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-px bg-gray-200" />
      <div className="px-6 py-3 flex justify-end bg-gray-50 rounded-b-2xl">
        <div className="flex gap-2">
          <ActionIcon
            onClick={handleView}
            variant="subtle"
            color="gray"
            size="lg"
            title="View Details"
          >
            <IconEye size={18} />
          </ActionIcon>

          <ActionIcon
            onClick={handleDelete}
            variant="subtle"
            color="red"
            size="lg"
            title="Cancel Appointment"
          >
            <IconTrash size={18} />
          </ActionIcon>
        </div>
      </div>
    </div>
  );
};

export default ApCard;
