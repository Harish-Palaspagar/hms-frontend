import { Avatar, Text } from "@mantine/core";
import {
  IconCalendarBolt,
  IconHeartbeat,
  IconLayoutBoard,
  IconMedicalCross,
  IconVaccine,
  IconWheelchair,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import useProtectedImage from "../../Admin/Utility/useProtectedImage";
import { getUserProfile } from "../../../Services/UserService";
import { useEffect, useState } from "react";

const links = [
  {
    name: "Dashboard",
    url: "/doctor/dashboard",
    icon: <IconLayoutBoard stroke={1.5} />,
  },
  
  {
    name: "Patients",
    url: "/doctor/patients",
    icon: <IconWheelchair stroke={1.5} />,
  },
  {
    name: "Profile",
    url: "/doctor/profile",
    icon: <IconHeartbeat stroke={1.5} />,
  },
  {
    name: "Appointments",
    url: "/doctor/appointments",
    icon: <IconCalendarBolt stroke={1.5} />,
  },
  {
    name: "Pharmacy",
    url: "/doctor/pharmacy",
    icon: <IconVaccine stroke={1.5} />,
  },
];

const Sidebar = () => {
   const[picId,setPicId]=useState<string | null>(null);
  useEffect(() => {
    if(!user) return;
    getUserProfile(user.id).then((response) => {
      setPicId(response.profilePictureId);
    }).catch((error) => {
      console.error("Error fetching user profile:", error);
    });
  }, []);

  const url = useProtectedImage(picId);
  const user = useSelector((state: any) => state.user);
  return (
    <div className="flex">
      <div className="w-64"></div>
      <div className="fixed w-64 h-screen bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 overflow-y-auto flex flex-col shadow-2xl border-r border-neutral-700/50">
        <div className="fixed z-[500] w-64 bg-neutral-900 py-5 px-6 border-b border-neutral-700/30">
          <div className="flex gap-2.5 items-center">
            <div className="p-2 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl shadow-lg">
              <IconMedicalCross size={24} stroke={1.5} className="text-white" />
            </div>
            <span className="font-heading font-semibold text-2xl bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
              HealthFlex
            </span>
          </div>
        </div>
        <div className="flex flex-col mt-24 gap-6 w-full px-5 pt-2">
          <div className="flex flex-col items-center py-6 px-4 bg-neutral-800/60 rounded-2xl border border-neutral-700/50 shadow-xl">
            <Avatar size="xl" src={url} alt="Doctor Avatar" />
            <span className="text-white text-lg mt-2 text-center break-words">
              {user?.name || "Guest"}
            </span>
            <Text style={{ color: "#fda4af", fontSize: "14px" }} className="text-center">
              {user?.role || "No role"}
            </Text>
          </div>
          <nav className="flex flex-col gap-1.5 pb-6">
            {links.map((link) => (
              <NavLink
                key={link.url}
                to={link.url}
                className={({ isActive }) =>
                  `group cursor-pointer flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-lg scale-[1.02]"
                      : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white hover:translate-x-1"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`transition-transform duration-300 ${
                        isActive ? "scale-110" : "group-hover:scale-110"
                      }`}
                    >
                      {link.icon}
                    </span>
                    <span className="text-[15px] tracking-wide">
                      {link.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
