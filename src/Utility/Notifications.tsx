import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

const successNotification = (message: string) => {
  notifications.show({
    title: "Success",
    message: message,
    color: "primary.3",
    icon: <IconCheck />,
    withCloseButton: true,
    withBorder: true,
    className: "!border-primary-500",
  });
};
const errorNotification = (message: string) => {
  notifications.show({
    title: "Error",
    message: message,
    color: "red",
    withCloseButton: true,
    withBorder: true,
    className: "!border-red-500",
  });
};

export { successNotification, errorNotification };
