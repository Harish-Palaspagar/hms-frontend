import React, { useEffect, useState } from "react";
import { ScrollArea, ThemeIcon, Badge } from "@mantine/core";
import {
  IconUser,
  IconClock,
  IconStethoscope,
  IconCalendar,
} from "@tabler/icons-react";
import { getTodayAppointment } from "../../../Services/AppointmentService";

const Appointment = () => {
  const [tdAppointment, setTdAppointment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodayAppointment()
      .then((response) => {
        console.log("Today Appointments:", response);
        setTdAppointment(Array.isArray(response) ? response : [response]);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const card = (app: any, index: number) => {
    return (
      <div
        key={app.id ?? index}
        className="p-4 mb-3 border border-violet-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-violet-300 transition-all duration-300 cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
              <IconUser size={20} className="text-violet-600" />
            </div>

            <div>
              <div className="font-semibold text-gray-800">
                {app.patientName}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <IconStethoscope size={12} />
                {app.doctorName}
              </div>
            </div>
          </div>

          <Badge
            variant="light"
            color={
              app.status === "COMPLETED"
                ? "green"
                : app.status === "CANCELLED"
                ? "red"
                : "violet"
            }
            size="sm"
          >
            {app.status}
          </Badge>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IconClock size={16} className="text-violet-500" />
            <span className="font-medium">
              {new Date(app.appointmentTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
            {app.reason || "—"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-5 border border-violet-200 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-gray-800">
            Today's Appointments
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {tdAppointment.length} scheduled
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center shadow-md">
          <IconCalendar size={20} className="text-white" />
        </div>
      </div>

      {/* Body */}
      <ScrollArea.Autosize mah={400} className="w-full">
        <div className="pr-2">
          {loading ? (
            <div className="text-center text-gray-500 py-6">
              Loading appointments...
            </div>
          ) : tdAppointment.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No appointments today
            </div>
          ) : (
            tdAppointment.map((app, index) => card(app, index))
          )}
        </div>
      </ScrollArea.Autosize>
    </div>
  );
};

export default Appointment;
