
import type { UpdateUser, User } from "types/types";
import api from "./api";

export const getUsers = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`users?page=${page}&limit=${limit}`);
  return response.data;
};

export const fetchUsers = ({
  queryKey,
}: {
  queryKey: [string, number, number];
}) => {
  const [, page, limit] = queryKey;
  return getUsers(page, limit);
};

export const createNewUser = async (data: Omit<User, "id">) => {
  const response = await api.post(`users/new`, data);
  return response.data;
};

export const updateUser = async (id: number, data: UpdateUser) => {
  const response = await api.put(`users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`users/${id}`);

  return response.data;
};
