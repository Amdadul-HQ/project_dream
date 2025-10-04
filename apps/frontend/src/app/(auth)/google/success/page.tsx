"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import useUser from "@/hooks/useUser";

export default function GoogleAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setIsLoading } = useUser();

  useEffect(() => {
    const processAuth = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        toast.error(getErrorMessage(error));
        router.push("/login");
        return;
      }

      if (token) {
        try {
          // Fetch user profile with token
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            
            // Set user in context
            setUser(userData.data);
            setIsLoading(false);
            
            toast.success("Google login successful!");
            
            // Route based on user role
            if (userData.data.role === "USER" || userData.data.role === "WRITER") {
              router.push("/profile/overview");
            } else if (userData.data.role === "ADMIN") {
              router.push("/admin/posts");
            } else {
              router.push("/profile/overview");
            }
          } else {
            throw new Error("Failed to fetch user profile");
          }
        } catch (err) {
          console.error("Auth processing error:", err);
          toast.error("Authentication failed. Please try again.");
          router.push("/login");
        }
      } else {
        toast.error("No authentication token received");
        router.push("/login");
      }
    };

    processAuth();
  }, [searchParams, router, setUser, setIsLoading]);

  const getErrorMessage = (error: string): string => {
    const errorMessages: Record<string, string> = {
      no_code: "Authorization code not received from Google",
      google_auth_failed: "Google authentication failed. Please try again.",
      unknown: "An unknown error occurred",
    };
    return errorMessages[error] || "Authentication failed";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Completing Google Sign-In...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we log you in</p>
      </div>
    </div>
  );
}