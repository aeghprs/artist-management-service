import { Badge } from "@mantine/core";

export const RoleBadge = ({ role }: { role: string }) => {
  const colorMap: Record<string, string> = {
    super_admin: "primary.5",
    artist_manager: "secondary.3",
    artist: "danger.3",
  };

  return (
    <Badge color={colorMap[role]} variant="light" radius="xl">
      {role.replace("_", " ").toUpperCase()}
    </Badge>
  );
};
