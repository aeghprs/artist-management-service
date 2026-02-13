import { useCallback } from "react";

const useLocalStorage = () => {
  const setToken = useCallback((key: string, value: string) => {
    localStorage.setItem(key, value);
  }, []);

  const getToken = useCallback((key: string) => {
    return localStorage.getItem(key);
  }, []);

  const removeToken = useCallback((key: string) => {
    localStorage.removeItem(key);
  }, []);

  return { setToken, getToken, removeToken };
};

export default useLocalStorage;
