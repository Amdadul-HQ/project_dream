"use client";

import { ChatWindow } from "@/components/chat/ChatWindow";
import UserProvider from "@/context/UserContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

// import { Toaster } from "react-hot-toast";
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <UserProvider>
           <ChatProvider>
            {children}
            <Toaster position="top-center" />
            <ChatWindow />
          </ChatProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </>
  );
};

export default Providers;
