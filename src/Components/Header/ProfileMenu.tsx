import { Menu, Text, Avatar } from "@mantine/core";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserProfile } from "../../Services/UserService";
import useProtectedImage from "../Admin/Utility/useProtectedImage";
import { useMediaQuery } from "@mantine/hooks";

const ProfileMenu = () => {
  const matches = useMediaQuery("(max-width: 768px)");

  const user = useSelector((state: any) => state.user);
  const [picId, setPicId] = useState<string | null>(null);
  useEffect(() => {
    if (!user) return;
    getUserProfile(user.id)
      .then((response) => {
        setPicId(response.profilePictureId);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  const url = useProtectedImage(picId);
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <div className="flex items-center gap-3 cursor-pointer">
         {!matches && <span className="font-semibold text-md text-neutral-900">
            {user.name}
          </span> }
          <Avatar size={50} src={url} alt="it's me" />
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
        <Menu.Item leftSection={<IconMessageCircle size={14} />}>
          Messages
        </Menu.Item>
        <Menu.Item leftSection={<IconPhoto size={14} />}>Gallery</Menu.Item>
        <Menu.Item
          leftSection={<IconSearch size={14} />}
          rightSection={
            <Text size="xs" c="dimmed">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item leftSection={<IconArrowsLeftRight size={14} />}>
          Transfer my data
        </Menu.Item>
        <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
          Delete my account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
