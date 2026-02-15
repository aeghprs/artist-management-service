import type { Song } from "types/types";
import api from "./api";

export const getSongs = async (
  id: number,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await api.get(
    `songs/artist/${id}?page=${page}&limit=${limit}`,
  );
  return response.data.data;
};

export const fetchSongs = ({
  queryKey,
}: {
  queryKey: [string, number | undefined, number, number];
}) => {
  const [, id, page, limit] = queryKey;
  if (!id) return;
  return getSongs(id, page, limit);
};

export const createNewSong = async (data: Omit<Song, "id">) => {
  const response = await api.post(`songs/artist/${data.artist_id}`, data);
  return response.data;
};

export const updateSong = async (
  id: number,
  data: Omit<Song, "id" | "artist_id">,
) => {
  const response = await api.put(`songs/${id}`, data);
  return response.data;
};

export const deleteSong = async (id: number) => {
  const response = await api.delete(`songs/${id}`);

  return response.data;
};
