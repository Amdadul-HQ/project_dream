"use server";
export const getAllCategories = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/post-category`, {
      method: "GET",
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    return Error(error);
  }
};
