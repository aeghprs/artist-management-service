import type { RegisterArtist } from "types/types";
import api from "./api";

export const getArtists = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`artist?page=${page}&limit=${limit}`);
  return response.data;
};

export const fetchArtists = ({
  queryKey,
}: {
  queryKey: [string, number, number];
}) => {
  const [, page, limit] = queryKey;
  return getArtists(page, limit);
};

export const createNewArtist = async (data: RegisterArtist) => {
  const response = await api.post(`artist/new`, data);
  return response.data;
};

export const updateArtist = async (id: number, data: RegisterArtist) => {
  const response = await api.put(`artist/${id}`, data);
  return response.data;
};

export const deleteArtist = async (id: number) => {
  const response = await api.delete(`artist/${id}`);

  return response.data;
};

export const getSongsByArtistId = async (
  id: number,
  page: number,
  limit: number,
) => {
  const response = await api.get(
    `songs/artist/${id}?page=${page}&limit=${limit}`,
  );

  return response.data.data;
};

export const handleArtistCSVExport = async (): Promise<Blob> => {
  const response = await api.get(`artist/export`, {
    responseType: "blob",
  });

  return response.data;
};
