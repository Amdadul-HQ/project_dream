"use server";

import { getToken } from "@/lib/getToken";
import { revalidateTag } from "next/cache";

export const createBlogPost = async (blogData: FormData) => {
  const token = await getToken();
  console.log(token);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/writer/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: blogData,
    });
    revalidateTag("BLOG");
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
