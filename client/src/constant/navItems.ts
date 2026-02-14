import {
  IconLayoutDashboard,
  IconUsers,
  IconMicrophone2,
  IconTrendingUp,
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
    icon: IconMicrophone2,
    link: "/artists",
    roles: ["super_admin", "artist_manager"],
  },
  {
    label: "Songs",
    icon: IconTrendingUp,
    link: "/artists",
    roles: ["artist"],
  },
];
