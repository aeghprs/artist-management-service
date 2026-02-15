import type { Role } from "./userDefaultValues";

interface Permissions {
  canView?: Role[];
  canEdit?: Role[];
  canDelete?: Role[];
}

export const TABLE_PERMISSIONS: Record<"users" | "artists" | "songs", Permissions> = {
  users: {
    canEdit: ["super_admin"],
    canDelete: ["super_admin"],
  },
  artists: {
    canView: ["super_admin", "artist_manager"],
    canEdit: ["artist_manager"],
    canDelete: ["artist_manager"],
  },
  songs: {
    canEdit: ["artist"],
    canDelete: ["artist"],
  },
};
