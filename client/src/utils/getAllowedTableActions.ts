import { TABLE_PERMISSIONS } from "constant/TablePermissions";
import type { Role } from "constant/userDefaultValues";

export const getAllowedActions = (
  table: "users" | "artists" | "songs",
  role: Role | undefined,
) => {
  if (!role) return {}
  const perms = TABLE_PERMISSIONS[table];
  return {
    canView: perms.canView?.includes(role),
    canEdit: perms.canEdit?.includes(role),
    canDelete: perms.canDelete?.includes(role),
  };
};
