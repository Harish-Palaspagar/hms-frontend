import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DoctorPatientCard from "./DoctorPatientCard";
import { getPatientByDoctorId } from "../../../Services/AppointmentService";

const Patients = () => {
  const user = useSelector((state: any) => state.user);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    getPatientByDoctorId(user.id)
      .then((response) => {
        setPatients(Array.isArray(response) ? response : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div>
      <div className="pb-3 text-xl font-semibold text-primary-500">
        Patients
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading patients...</div>
      ) : patients.length === 0 ? (
        <div className="text-sm text-gray-500">No patients found</div>
      ) : (
        patients.map((patient) => (
          <DoctorPatientCard
            key={patient.patientId}
            patientName={patient.patientName}
            email={patient.email}
            phoneNumber={patient.phoneNumber}
            appointmentCount={patient.appointmentCount}
          />
        ))
      )}
    </div>
  );
};

export default Patients;
