"use server";

import { getToken } from "@/lib/getToken";
import { revalidateTag } from "next/cache";

// Get all series by authenticated user
export const getUserSeries = async () => {
  const token = await getToken();
  
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/writer/post/series-by-user`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch series");
    }

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching series:", error);
    return { success: false, message: error.message };
  }
};

// Create new series
export const createSeries = async (seriesData: {
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
}) => {
  const token = await getToken();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/writer/post/create-series`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seriesData),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create series");
    }

    revalidateTag("SERIES");
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Error creating series:", error);
    return { success: false, message: error.message };
  }
};

// Update existing blog post service
export const createBlogPost = async (blogData: FormData) => {
  const token = await getToken();
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/writer/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: blogData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create post");
    }

    revalidateTag("BLOG");
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return { success: false, message: error.message };
  }
};