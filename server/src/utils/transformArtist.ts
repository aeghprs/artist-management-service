type Artist = {
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

export const transformArtists = (artists: Artist[]) => {
  return artists.map(({ first_name, last_name, ...rest }) => ({
    ...rest,
    associatedUserName: `${first_name} ${last_name}`,
  }));
};