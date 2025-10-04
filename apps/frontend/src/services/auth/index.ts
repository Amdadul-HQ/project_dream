"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

/**
 * Register user with email/password
 */
export const registerUser = async (userData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/registration`, {
      method: "POST",
      body: userData,
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, message: error.message || "Registration failed" };
  }
};

/**
 * Login user with email/password
 */
export const loginUser = async (userData: FieldValues) => {
  const cookieStore = await cookies();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    if (result?.success) {
      // Save token in cookies
      cookieStore.set("accessToken", result?.data?.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Save user in cookies
      cookieStore.set("user", JSON.stringify(result?.data?.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return result;
  } catch (error: any) {
    console.error("Login error:", error);
    return { success: false, message: error.message || "Login failed" };
  }
};

/**
 * Get current logged-in user
 */
export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (accessToken && userCookie) {
    try {
      return JSON.parse(userCookie);
    } catch (err) {
      console.error("Error parsing user cookie:", err);
      return null;
    }
  }

  return null;
};

/**
 * Logout user
 */
export const logout = async () => {
  const cookieStore = await cookies();

  // Remove token and user from cookies
  cookieStore.delete("accessToken");
  cookieStore.delete("user");
};

/**
 * Store Google auth token and user after successful login
 */
export const storeGoogleAuthData = async (token: string, user: any) => {
  const cookieStore = await cookies();

  try {
    // Save token in cookies
    cookieStore.set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Save user in cookies
    cookieStore.set("user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Store auth data error:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Send Google JWT credential to backend
 */
export const sendGoogleLogin = async (data: { code: string }) => {
  const cookieStore = await cookies();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/google/credential`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: data.code }),
      }
    );

    const result = await res.json();

    if (result?.success) {
      // Save token in cookies
      cookieStore.set("accessToken", result?.data?.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Save user in cookies
      cookieStore.set("user", JSON.stringify(result?.data?.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return result;
  } catch (error: any) {
    console.error("Google login error:", error);
    return { success: false, message: error.message || "Google login failed" };
  }
};