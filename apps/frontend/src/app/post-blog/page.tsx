import PostBlog from "@/pages/PostBlog/PostBlog";
import { getAllCategories } from "@/services/categories";

const PostBlogPage = async () => {
  const categories = await getAllCategories();
  console.log(categories);
  return (
    <div>
      <PostBlog categoriesData={categories?.data} />
    </div>
  );
};

export default PostBlogPage;
