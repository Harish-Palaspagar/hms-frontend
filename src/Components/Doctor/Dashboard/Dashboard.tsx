import React from "react";
import Welcome from "./Welcome";
import Matrices from "./Matrices";
import DiseaseChart from "./DiseaseChart";
import PatientMetrics from "./PatientMetrics";
import Patient from "./Patient";
import Appointment from "./Appointment";
import { useMediaQuery } from "@mantine/hooks";

const Dashboard = () => {
  const matches = useMediaQuery("(max-width: 768px)");
  
  return (
    <div className="flex flex-col gap-5">
      <div className="grid lg:grid-cols-2 gap-5">
        <Welcome />
        <Matrices />
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <DiseaseChart />
        <div className="lg:col-span-2">
          <PatientMetrics />
        </div>

      </div>
        <div className="grid lg:grid-cols-2 gap-5">
            <Patient />
            <Appointment />
        </div>
    </div>
  );
};

export default Dashboard;
