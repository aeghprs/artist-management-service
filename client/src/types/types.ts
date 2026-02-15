export type UserRole = "super_admin" | "artist_manager" | "artist";
export type Gender = "m" | "f" | "o";
export type Genre = "rnb" | "country" | "classic" | "rock" | "jazz";

export interface User {
  id: string;
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

export type RegisterUser = Omit<User, "id"> & {
  confirmPassword: string;
};
export type UpdateUser = Omit<User, "id" | "password">;
export type LoginUser = Pick<User, "email" | "password">;

export type UserFormValues = RegisterUser | Omit<User, "password">;

export interface Artist {
  id: number;
  user_id: number | string;
  associatedUserName: string;
  name: string;
  dob: string;
  gender: Gender;
  address: string;
  first_release_year: number;
  no_of_albums_released: number;
}
export type RegisterArtist = Omit<Artist, "id" | "associatedUserName">;
export type ArtistFormValues = Artist | RegisterArtist;

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

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ArtistSongsResponse {
  artist: Pick<Artist, "id" | "name">;
  songs: Song[];
  pagination: Pagination;
}

export interface SongListItem {
  artist_name: string;
  title: string;
  album_name: string;
  genre: string;
}

export type AssociatedUsersForArtist =
  | {
      first_name: string;
      last_name: string;
      id: number;
    }[]
  | [];
