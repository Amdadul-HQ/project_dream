// hooks/useGoogleAuth.ts
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useUser from "@/hooks/useUser";
import { sendGoogleLogin } from "@/services/auth";
import { useEffect, useState } from "react";
import type { CredentialResponse } from "@react-oauth/google";

export default function useGoogleAuth() {
  const router = useRouter();
  const { setUser, setIsLoading } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!isMounted) return;

    if (credentialResponse?.credential) {
      setIsLoading(true);

      try {
        // Send the JWT credential to your backend
        const res = await sendGoogleLogin({ 
          code: credentialResponse.credential 
        });

        if (res?.success) {
          toast.success("Login successful!");
          
          // Create user object with token
          const userWithToken = {
            ...res?.data?.user,
            token: res?.data?.token,
          };
          
          setUser(userWithToken);
          
          // Redirect based on role
          if (res?.data?.user?.role === "USER") {
            router.push(`/profile/overview`);
          } else if (res?.data?.user?.role === "ADMIN") {
            router.push(`/admin/posts`);
          }
        } else {
          toast.error(res?.message || "Login failed. Please try again.");
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Login failed. No credential received.");
    }
  };

  const handleError = () => {
    toast.error("Google login failed. Please try again.");
    setIsLoading(false);
  };

  return { handleSuccess, handleError };
}