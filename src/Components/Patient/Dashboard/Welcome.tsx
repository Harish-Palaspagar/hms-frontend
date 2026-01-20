import { Avatar, Badge } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserProfile } from "../../../Services/UserService";
import useProtectedImage from "../../Admin/Utility/useProtectedImage";
import { IconDroplet, IconMapPin } from "@tabler/icons-react";
import { getPatient } from "../../../Services/PatientProfileService";
import { formatBloodGroup } from "../../../Utility/AddZeroMonth";
import { getAllMedicinesByPatientId, getAppointmentDetailsByPatient } from "../../../Services/AppointmentService";

const Welcome = () => {
  const user = useSelector((state: any) => state.user);
  const [picId, setPicId] = useState<string | null>(null);
  const [patient, setPatient] = useState<any>({});

   const [data, setData] = useState<any[]>([]);
    const [dataD, setDataD] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    getUserProfile(user.id)
      .then((res) => setPicId(res.profilePictureId))
      .catch(console.error);

    getPatient(user.profileId)
      .then((res) => {
        setPatient(res);
      })
      .catch(console.error);
      if (!user?.profileId) return;

    getAllMedicinesByPatientId(user.profileId)
      .then((response) => {
        setData(Array.isArray(response) ? response : [response]);
      })
      .catch(console.error);

      if (!user?.profileId) return;

    getAppointmentDetailsByPatient(user.profileId)
      .then((response) => {
        setDataD(Array.isArray(response) ? response : [response]);
      })
      .catch((error) => {
        console.error(error);
      })
  }, [user?.id, user?.profileId]);



  const url = useProtectedImage(picId);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative h-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
      {/* Soft background accent */}
      <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyan-100 blur-3xl opacity-60" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-md font-medium text-cyan-600">
              {getGreeting()}!
            </p>
            <h2 className="mt-1 text-2xl font-bold text-gray-800">
              {user?.name || "Patient"}
            </h2>

            {/* Patient details */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge
                size="lg"
                variant="light"
                color="red"
                leftSection={<IconDroplet size={14} />}
              >
                Blood Group : {formatBloodGroup(patient?.bloodGroup)}
              </Badge>

              <Badge
                size="lg"
                variant="light"
                color="blue"
                leftSection={<IconMapPin size={14} />}
              >
                Location : {patient?.address || "Unknown"}
              </Badge>
            </div>

            <p className="mt-10 text-md text-gray-500 max-w-lg">
              This dashboard helps you keep track of your appointments,
              medications, and important health information, making it easier to
              manage your care every day.
            </p>
          </div>

          {/* Avatar */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-cyan-200 blur-md opacity-40" />
            <Avatar
              src={url}
              alt={user?.name}
              size={125}
              radius="xl"
              className="relative z-10 border-4 border-white"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-violet-50 p-4">
            <p className="text-sm text-gray-500">Visits</p>
            <p className="mt-1 text-2xl font-bold text-violet-600">
              {dataD?.length || 0}+
            </p>
          </div>

          <div className="rounded-2xl bg-cyan-50 p-4">
            <p className="text-sm text-gray-500">Medications</p>
            <p className="mt-1 text-2xl font-bold text-cyan-600">
              {data?.length || 0}+
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
