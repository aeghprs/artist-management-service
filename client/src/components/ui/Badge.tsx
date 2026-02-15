import { Badge } from "@mantine/core";

export const DSBadge = ({ role }: { role: string }) => {
  const colorMap: Record<string, string> = {
    super_admin: "primary.5",
    artist_manager: "secondary.3",
    artist: "danger.3",
    country: "orange.4",
    rnb: "violet.4",
    classic: "yellow.5",
    jazz: "teal.4",
    rock: "gray.8",
  };

  return (
    <Badge color={colorMap[role]} variant="light" radius="xl">
      {role.replace("_", " ").toUpperCase()}
    </Badge>
  );
};
