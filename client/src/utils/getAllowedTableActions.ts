import { TABLE_PERMISSIONS } from "constant/TablePermissions";
import type { Role } from "constant/userDefaultValues";

type Table = "users" | "artists" | "songs";

export const getAllowedActions = (table: Table, role?: Role) => {
  if (!role)
    return {
      canView: false,
      canEdit: false,
      canDelete: false,
    };

  const perms = TABLE_PERMISSIONS[table];

  return {
    canView: perms?.canView?.includes(role) ?? false,
    canEdit: perms?.canEdit?.includes(role) ?? false,
    canDelete: perms?.canDelete?.includes(role) ?? false,
  };
};
