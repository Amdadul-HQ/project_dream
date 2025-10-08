import { createBlogPost } from "@/services/post";

export async function handleCreateBlogPost(formData: FormData) {
  return await createBlogPost(formData);
}