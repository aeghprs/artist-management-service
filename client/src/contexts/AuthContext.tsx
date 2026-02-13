import {
  type ReactNode,
  useState,
  createContext,
  useContext,
  type Dispatch,
  useEffect,
} from "react";

import { getUserData } from "api/auth.api";

import { DSNotification } from "components/ui/notifications";

import useLocalStorage from "hook/useLocalStorage";
import type { UserRole } from "../types/types";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
   isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useLocalStorage();


    const fetchUser = async () => {
    try {
      const res = await getUserData();
      if (res.success) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
      setUser(null);
      DSNotification.error("", "Failed to fetch user on reload:");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken("accessToken");

    if (!token) {
      setIsLoading(false);
      return;
    }

    fetchUser();
  }, [getToken]);


  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user, isLoading, }}>
      {children}
    </AuthContext.Provider>
  );
};
