// hooks/useLogin.ts
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import useUser from "@/hooks/useUser";
import { loginUser } from "@/services/auth";

export default function useLogin() {
  const router = useRouter();
  const { setUser, setIsLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (data: FieldValues) => {
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const res = await loginUser(data);

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
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return { handleLogin, isSubmitting };
}