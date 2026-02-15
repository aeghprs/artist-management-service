import { IconChartBar, IconDisc, IconMicrophone2, IconMusic } from "@tabler/icons-react";

export const DUMMY_STATS = [
  {
    label: "Total Artists",
    value: 20,
    icon: IconMicrophone2,
    color: "teal",
    desc: "Registered artists",
  },
  {
    label: "Total Songs",
    value: 130,
    icon: IconMusic,
    color: "orange",
    desc: "Across all artists",
  },
  {
    label: "Albums Released",
    value: 64,
    icon: IconDisc,
    color: "cyan",
    desc: "Combined catalog",
  },
  {
    label: "Genres",
    value: 6,
    icon: IconChartBar,
    color: "violet",
    desc: "Music categories",
  },
];
