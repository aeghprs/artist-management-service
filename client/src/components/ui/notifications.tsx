import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconX,
  IconInfoCircle,
  IconAlertTriangle,
} from "@tabler/icons-react";

export const DSNotification = {
  success: (title: string, message: string) => {
    notifications.show({
      title,
      message,
      color: "green",
      icon: <IconCheck size={18} />,
    });
  },

  error: (title: string, message: string) => {
    notifications.show({
      title,
      message,
      color: "red",
      icon: <IconX size={18} />,
    });
  },

  info: (title: string, message: string) => {
    notifications.show({
      title,
      message,
      color: "blue",
      icon: <IconInfoCircle size={18} />,
    });
  },

  warning: (title: string, message: string) => {
    notifications.show({
      title,
      message,
      color: "yellow",
      icon: <IconAlertTriangle size={18} />,
    });
  },

  show: (title: string, message: string, color?: string) => {
    notifications.show({
      title,
      message,
      color: color || "blue",
    });
  },
};
