"use client";

import PostBlog from "@/pages/PostBlog/PostBlog";
import { getAllCategories } from "@/services/categories";
import { useEffect, useState } from "react";
import { TCategories } from "@/types/categories.types";

const PostBlogPage = () => {
  const [categories, setCategories] = useState<TCategories[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <PostBlog categoriesData={categories} />
    </div>
  );
};

export default PostBlogPage;
