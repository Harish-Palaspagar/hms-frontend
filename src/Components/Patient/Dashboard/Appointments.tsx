import React, { useEffect, useState } from "react";
import { ScrollArea, Badge } from "@mantine/core";
import {
  IconClock,
  IconUser,
  IconCalendar,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { getAppointmentDetailsByPatient } from "../../../Services/AppointmentService";

const Appointments = () => {

  const user = useSelector((state: any) => state.user);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.profileId) return;

    getAppointmentDetailsByPatient(user.profileId)
      .then((response) => {
        setData(Array.isArray(response) ? response : [response]);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, [user?.profileId]);

  const card = (app: any, index: number) => {
    return (
      <div
        key={index}
        className="p-4 mb-3 border border-violet-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-violet-300 transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
              <IconUser size={20} className="text-violet-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                {app.doctorName}
              </div>
              <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                {app.reason}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IconClock size={16} className="text-violet-500" />
            <span className="font-medium">
              {new Date(app.appointmentTime).toLocaleString()}
            </span>
          </div>

          <Badge color="violet" variant="light">
            {app.status}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="p-5 border border-violet-200 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-gray-800">
            Appointments
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {data.length} scheduled
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center shadow-md">
          <IconCalendar size={20} className="text-white" />
        </div>
      </div>

      <ScrollArea.Autosize mah={400} mx="auto" className="w-full">
        <div className="pr-2">
          {loading ? (
            <div className="text-center text-gray-500">
              Loading...
            </div>
          ) : (
            data.map((app, index) => card(app, index))
          )}
        </div>
      </ScrollArea.Autosize>
    </div>
  );
};

export default Appointments;
