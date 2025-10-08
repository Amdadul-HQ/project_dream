"use server";

import { cookies } from "next/headers";

export const getToken = async (): Promise<string> => {
  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken")!.value;

  return token;
};
