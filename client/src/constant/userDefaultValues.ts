export const LOGIN_DEFAULT_VALUES = {
  email: "",
  password: "",
};

export const USER_DEFAULT_VALUES = {
  first_name: "",
  last_name: "",
  phone: "",
  dob: "",
  address: "",
  gender: "",
  role: "",
  ...LOGIN_DEFAULT_VALUES,
};

export const USER_ROLES = {
  super_admin: "Super Admin",
  artist_manager: "Artist Manager",
  artist: "Artist",
} as const;

export type Role = keyof typeof USER_ROLES;
