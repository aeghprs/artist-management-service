import type { User } from "../types/types";

export const LOGIN_DEFAULT_VALUES = {
  email: "",
  password: "",
};

export const USER_VALUES: Omit<User, "id" | "email" | "password"> = {
  first_name: "",
  last_name: "",
  phone: "",
  dob: "",
  address: "",
  gender: "m",
  role: "artist",
};

export const USER_DEFAULT_VALUES = {
  ...USER_VALUES,
  ...LOGIN_DEFAULT_VALUES,
};

export const USER_ROLES = {
  super_admin: "Super Admin",
  artist_manager: "Artist Manager",
  artist: "Artist",
} as const;

export type Role = keyof typeof USER_ROLES;
