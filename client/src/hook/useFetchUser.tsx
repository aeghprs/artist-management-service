import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getUserData } from "api/auth.api";

import { useAuth } from "contexts/AuthContext";

export const useLoadUser = () => {
  const { setUser } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: getUserData,
    enabled: false,
  });

  useEffect(() => {
    if (!data) return;

    if (data.success) {
      setUser(data.data);
    }
  }, [data, setUser]);

  return { data, isLoading, isError, refetch };
};
