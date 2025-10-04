/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useUser from "@/hooks/useUser";
import { sendGoogleLogin } from "@/services/auth";
import { useEffect, useState } from "react";

export default function useGoogleAuth() {
  const router = useRouter();
  const { setUser, setIsLoading } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSuccess = async (credentialResponse: any) => {
    if (!isMounted) return;
    
    if (credentialResponse?.credential) {
      try {
        const res = await sendGoogleLogin({ code: credentialResponse.credential });
        if (res?.success) {
          toast.success("Login successful!");
          setUser(res?.data?.user);
          setIsLoading(false);
          if (res?.data?.user?.role === "USER") {
            router.push(`/profile/overview`);
          }
          if (res?.data?.user?.role === "ADMIN") {
            router.push(`/admin/posts`);
          }
        } else {
          toast.error(res?.message || "Login failed. Please try again later.");
        }
      } catch (error) {
        console.error("Google login decode error:", error);
        toast.error("Login failed. Invalid token.");
      }
    } else {
      toast.error("Login failed. No credential found.");
    }
  };

  const handleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return { handleSuccess, handleError };
}
