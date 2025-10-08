"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

/**
 * Helper function to save user data in cookies
 */
const saveAuthData = async (token: string, user: any) => {
  const cookieStore = await cookies();

  // Save token in cookies
  cookieStore.set("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Save essential user data in cookies
  const userCookieData = {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    address: user.address,
    profile: user.profile,
    isVerified: user.isVerified,
    role: user.role,
    isGoogle: user.isGoogle,
    status: user.status,
  };

  cookieStore.set("user", JSON.stringify(userCookieData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
};

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
      await saveAuthData(result?.data?.token, result?.data?.user);
    }

    return result;
  } catch (error: any) {
    console.error("Login error:", error);
    return { success: false, message: error.message || "Login failed" };
  }
};

/**
 * Get current logged-in user with token
 */
export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (accessToken && userCookie) {
    try {
      const user = JSON.parse(userCookie);
      return {
        ...user,
        token: accessToken,
      };
    } catch (err) {
      console.error("Error parsing user cookie:", err);
      return null;
    }
  }

  return null;
};

/**
 * Get access token
 */
export const getAccessToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
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
  try {
    await saveAuthData(token, user);
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
      await saveAuthData(result?.data?.token, result?.data?.user);
    }

    return result;
  } catch (error: any) {
    console.error("Google login error:", error);
    return { success: false, message: error.message || "Google login failed" };
  }
};

/**
 * Update user profile data in cookies
 */
export const updateUserInCookie = async (updatedUser: any) => {
  const cookieStore = await cookies();

  try {
    const userCookieData = {
      id: updatedUser.id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      email: updatedUser.email,
      address: updatedUser.address,
      profile: updatedUser.profile,
      isVerified: updatedUser.isVerified,
      role: updatedUser.role,
      isGoogle: updatedUser.isGoogle,
      status: updatedUser.status,
    };

    cookieStore.set("user", JSON.stringify(userCookieData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Update user cookie error:", error);
    return { success: false, message: error.message };
  }
};