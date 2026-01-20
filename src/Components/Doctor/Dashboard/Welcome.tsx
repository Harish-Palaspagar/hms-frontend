import { Avatar, Badge } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserProfile } from "../../../Services/UserService";
import useProtectedImage from "../../Admin/Utility/useProtectedImage";
import { IconStethoscope, IconMedicalCross } from "@tabler/icons-react";
import { getDoctor } from "../../../Services/DoctorProfileService";
import { getAppointmentDetailsByDoctor, getPatientByDoctorId } from "../../../Services/AppointmentService";

const Welcome = () => {
  const user = useSelector((state: any) => state.user);
  const [picId, setPicId] = useState<string | null>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [dataD, setDataD] = useState<any[]>([]);
  const [patient, setPatient] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    getUserProfile(user.id)
      .then((res) => setPicId(res.profilePictureId))
      .catch(console.error);

    getDoctor(user.id)
      .then((res) => {
        console.log("docs :", res);
        setDoctor(res);
      })
      .catch(console.error);
       getAppointmentDetailsByDoctor(user.id)
        .then((response) => {
          setDataD(Array.isArray(response) ? response : []);
        })
        .catch((error) => {
          console.error("Error fetching appointments", error);
        })

        getPatientByDoctorId(user.id)
        .then((response) => {
          setPatient(response);
        })
        .catch((error) => {
          console.error("Error fetching appointments", error);
        })
  }, [user?.id]);

  const url = useProtectedImage(picId);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative h-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
      <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-violet-100 blur-3xl opacity-60" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-md font-medium text-violet-600">
              {getGreeting()} !
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-800">
              Dr. {doctor?.name || user?.name || "Doctor"}
            </h2>

            {/* ✅ Dynamic badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              {doctor?.specialization && (
                <Badge
                  size="lg"
                  variant="light"
                  color="violet"
                  leftSection={<IconStethoscope size={14} />}
                >
                  {doctor.specialization}
                </Badge>
              )}

              {doctor?.department && (
                <Badge
                  size="lg"
                  variant="light"
                  color="cyan"
                  leftSection={<IconMedicalCross size={14} />}
                >
                  {doctor.department}
                </Badge>
              )}
            </div>

            <p className="mt-12 text-md text-gray-500">
              Wishing you a productive day delivering quality care, making
              thoughtful decisions, and improving the lives of every patient you
              attend to.
            </p>
          </div>

          {/* Avatar */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-violet-200 blur-md opacity-40" />
            <Avatar
              src={url}
              alt={doctor?.name || user?.name}
              size={125}
              radius="xl"
              className="relative z-10 border-4 border-white"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-violet-50 p-4">
            <p className="text-sm text-gray-500">Appointments</p>
            <p className="mt-1 text-2xl font-bold text-violet-600">
              {dataD?.length || 0}+
            </p>
          </div>

          <div className="rounded-2xl bg-cyan-50 p-4">
            <p className="text-sm text-gray-500">Patients</p>
            <p className="mt-1 text-2xl font-bold text-cyan-600">
              {patient?.length || 0}+
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
