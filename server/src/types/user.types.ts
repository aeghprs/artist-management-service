export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender: "m" | "f" | "o";
  address: string;
  role: "super_admin" | "artist_manager" | "artist";
  created_at?: string;
  dob: string;
}
