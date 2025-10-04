"use client";

import UserProvider from "@/context/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

// import { Toaster } from "react-hot-toast";
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <UserProvider>
          <Toaster position="top-center" />
          {children}
        </UserProvider>
      </GoogleOAuthProvider>
    </>
  );
};

export default Providers;
