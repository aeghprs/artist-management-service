import { AxiosError } from "axios";

export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  // If AxiosError with response.data.message
  if ((err as AxiosError<{ message: string }>)?.response?.data?.message) {
    return (err as AxiosError<{ message: string }>).response!.data!.message;
  }

  // If a standard Error
  if (err instanceof Error && err.message) {
    return err.message;
  }

  // Fallback
  return fallback;
}