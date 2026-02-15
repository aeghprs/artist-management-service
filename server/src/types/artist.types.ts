export interface Artist {
  id: number;
  name: string;
  dob: string;
  gender: string;
  address: string;
  first_release_year: number;
  no_of_albums_released: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export type IBatchArtist = Omit<Artist, "created_at" | "updated_at" | "id">;

export interface ArtistCSVRow {
  name: string;
  dob: string;
  gender: string;
  address: string;
  first_release_year: string;
  no_of_albums_released: string;
  user_id: string;
}

export type ArtistResult = {
  id: number;
  name: string;
  dob: string;
  gender: string;
  address: string;
  first_release_year: number;
  no_of_albums_released: number;
  user_id: number;
  first_name: string;
  last_name: string;
};