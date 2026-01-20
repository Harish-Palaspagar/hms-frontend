import { ActionIcon, Button } from "@mantine/core";
import { IconBellRinging, IconLayoutSidebar } from "@tabler/icons-react";
import React from "react";
import ProfileMenu from "./ProfileMenu";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeJwt } from "../../Slices/JwtSlice";
import { removeUser } from "../../Slices/UserSlice";
import SideDrawer from "../SideDrawer/SideDrawer";
import { useMediaQuery } from "@mantine/hooks";

const Header = () => {
  const dispatch = useDispatch();
  const jwt = useSelector((state: any) => state.jwt);
  const handleLogout = () => {
    dispatch(removeJwt());
    dispatch(removeUser());
  };
  const matches = useMediaQuery('(max-width: 768px)')
  return (
    <div className="bg-red-200 w-full h-20 flex justify-between px-5 items-center">
        {matches && <SideDrawer/>}
        <div></div>
      <div className="flex gap-5 items-center">
        {jwt ? (
          <>
            <Button onClick={handleLogout}>Logout</Button>
          
            <ProfileMenu />
          </>
        ) : (
          <Link to="login">
            <Button color="#881337">Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;