"use client";

import { getCurrentUser } from "@/services/auth";
import { IUser } from "@/types/user.types";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

export interface IUserProviderValues {
  user: IUser | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

//Create Context
export const UserContext = createContext<IUserProviderValues | undefined>(
  undefined
);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  const handleUser = useCallback(async () => {
    if (!isMounted) return;
    try {
      const user = await getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      handleUser();
    }
  }, [isMounted, handleUser]);

  const contextValue = {
    user,
    isLoading,
    setIsLoading,
    setUser,
  };

  // Don't render provider until client-side is mounted
  if (!isMounted) {
    return (
      <UserContext.Provider
        value={{
          user: null,
          isLoading: true,
          setIsLoading: () => {},
          setUser: () => {},
        }}
      >
        {children}
      </UserContext.Provider>
    );
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
