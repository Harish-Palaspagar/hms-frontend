import React from "react";
import Sidebar from "../Components/Admin/Sidebar/Sidebar";
import Header from "../Components/Header/Header";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

const AdminDashboard = () => {
  const matches = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex ">
      {!matches && <Sidebar />}
      <div className="w-full overflow-hidden flex flex-col">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
