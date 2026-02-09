export interface Artist {
  id: number;
  name: string;
  dob: string;
  gender: string;
  address: string;
  first_release_year: number;
  no_of_albums_released: number;
  created_at: string;
  updated_at: string;
}

export type IBatchArtist = Omit<Artist, "created-at" | "updated_at" | "id">;
