export type UserRole = "super_admin" | "artist_manager" | "artist";
export type Gender = "m" | "f" | "o";
export type Genre = "rnb" | "country" | "classic" | "rock" | "jazz";

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  gender: Gender;
  address: string;
  role: UserRole;
}

export type RegisterUser = Omit<User, "id" | "created_at" | "updated_at"> & {
  confirmPassword: string;
};
export type LoginUser = Pick<User, "email" | "password">;

export interface Artist {
  id: number;
  name: string;
  dob: string;
  gender: Gender;
  address: string;
  first_release_year: number;
  no_of_albums_released: number;
  created_at: string;
  updated_at: string;
}

export interface Song {
  id: number;
  artist_id: number;
  title: string;
  album_name: string;
  genre: Genre;
  created_at: string;
  updated_at: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: ValidationError[];
}
