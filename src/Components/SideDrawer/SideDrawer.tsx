import { ActionIcon, Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLayoutSidebar, IconMenu2 } from "@tabler/icons-react";
import React from "react";
import Sidebar from "../Patient/Sidebar/Sidebar";
import { useSelector } from "react-redux";
import DoctorSidebar from "../Doctor/Sidebar/Sidebar";
import AdminSidebar from "../Admin/Sidebar/Sidebar";

const SideDrawer = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const user = useSelector((state: any) => state.user);
  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        withCloseButton={false}
        padding={0}
        size="auto"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        {user?.role == "PATIENT" ? (
          <Sidebar />
        ) : user?.role == "DOCTOR" ? (
          <DoctorSidebar />
        ) : (
          <AdminSidebar />
        )}
      </Drawer>
      
      <ActionIcon
        onClick={open}
        variant="transparent"
        size="lg"
        aria-label="Settings"
      >
        <IconMenu2
          style={{ width: "80%", height: "80%" }}
          stroke={1.5}
        />
      </ActionIcon>
    </>
  );
};

export default SideDrawer;
