import {
  IconLayoutDashboard,
  IconUsers,
  IconUser,
} from "@tabler/icons-react";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: IconLayoutDashboard,
    link: "/dashboard",
    roles: ["super_admin", "artist_manager", "artist"],
  },
  {
    label: "Users",
    icon: IconUsers,
    link: "/users",
    roles: ["super_admin"],
  },
  {
    label: "Artists",
    icon: IconUser,
    link: "/artists",
    roles: ["super_admin", "artist_manager"],
  },
];