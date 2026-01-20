import React, { useEffect, useState } from "react";
import { getAllPatients } from "../../../Services/PatientProfileService";
import PatientCard from "./PatientCard";

const Patient = () => {
  const [patients, setPatients] = useState<any[]>([]);
  useEffect(() => {
    getAllPatients()
      .then((response) => {
        console.log(response);
        setPatients(response);
      })
      .catch((error) => {
        console.error("There was an error fetching the patients!", error);
      });
  }, []);

  return (
    <div>
      <div className="text-xl text-primary-500 font-bold pb-3">Patients</div>
      <div>
        {patients.map((patient) => (
          <PatientCard key={patient.id} {...patient} />
        ))}
      </div>
    </div>
  );
};

export default Patient;
