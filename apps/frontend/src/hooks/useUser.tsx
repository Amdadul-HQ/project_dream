"use client";

import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";

const useUser = () => {
  const context = useContext(UserContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR or before hydration, return a default context
  if (!isMounted) {
    return {
      user: null,
      isLoading: true,
      setUser: () => {},
      setIsLoading: () => {},
    };
  }

  if (context === undefined) {
    throw new Error("useUser must be used within the UserProvider context");
  }
  return context;
};
export default useUser;
