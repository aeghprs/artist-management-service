import type { ArtistSongsResponse, SongListItem } from "types/types";

export const transformSongs = (
  data: ArtistSongsResponse | undefined,
): SongListItem[] | [] => {
  if (!data) return [];
    console.log(data)

  return data.songs.map((song) => ({
    artist_name: data.artist.name,
    title: song.title,
    album_name: song.album_name,
    genre: song.genre,
  }));
};
