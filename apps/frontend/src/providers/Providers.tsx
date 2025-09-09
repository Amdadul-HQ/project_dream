"use client";

import UserProvider from "@/context/UserContext";
import { Toaster } from "sonner";

// import { Toaster } from "react-hot-toast";
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
        <UserProvider>
          <Toaster position="top-center" />
          {children}
        </UserProvider>
    </>
  );
};

export default Providers;
