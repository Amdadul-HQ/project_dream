"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

//Regiter user
export const registerUser = async (userData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/registration`, {
      method: "POST",
      body: userData,
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

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
      cookieStore.set("accessToken", result?.data?.token);

      // Save user in cookies
      cookieStore.set("user", JSON.stringify(result?.data?.user));
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (accessToken && userCookie) {
    try {
      // Return user info from cookies
      return JSON.parse(userCookie);
    } catch (err) {
      console.error("Error parsing user cookie:", err);
      return null;
    }
  }

  // Fallback → decode JWT if user cookie not found
  // if (accessToken) {
  //   try {
  //     const decodedData: any = jwtDecode(accessToken);
  //     return decodedData;
  //   } catch (err) {
  //     console.error("Error decoding token:", err);
  //     return null;
  //   }
  // }

  return null;
};

export const logout = async () => {
  const cookieStore = await cookies();

  // Remove token and user from cookies
  cookieStore.delete("accessToken");
  cookieStore.delete("user");
};

//Resend Verification mail
export const sendGoogleLogin = async (data: Record<string, any>) => {
  const cookieStore = await cookies();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/google/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (result?.success) {
      // Save token in cookies
      cookieStore.set("accessToken", result?.data?.token);

      // Save user in cookies
      cookieStore.set("user", JSON.stringify(result?.data?.user));
    }
    return result;
  } catch (error: any) {
    return { error: error.message };
  }
};
