import axios from "axios";
import api from "./api";
import type { User } from "types/types";

const BASE_URL = import.meta.env.VITE_API_URL;

export const login = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, data);
  return response.data;
};

export const register = async (data: Omit<User, "id">) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, data);
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await axios.post(`${BASE_URL}/auth/refresh`, {
    refreshToken,
  });
  return response.data;
};

export const getUserData = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
