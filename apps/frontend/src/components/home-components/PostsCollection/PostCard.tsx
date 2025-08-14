import { Bookmark } from "lucide-react";
import Image from "next/image";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuHeart } from "react-icons/lu";
import { TfiCommentAlt } from "react-icons/tfi";

interface PostItem {
  image: { src: string };
  title: string;
  content_type: string;
  writer_name: string;
  createdAt: string;
  content: string;
  like_count: number;
  comment_count: number;
}

const PostCard = ({ item }: { item: PostItem }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return `${day} ${month}`;
  };
  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 w-full p-4 bg-white text-secondary rounded-md hover:bg-gray-100 transition-colors duration-200 ease-in-out">
      <div className="w-[250px] h-[152px] rounded-md relative">
        <Image
          className="rounded-md"
          src={item.image.src}
          alt={item.title}
          width={250}
          height={152}
        />
        <p className="absolute top-1 left-1  px-2 py-1 rounded-md text-white text-xs capitalize bg-black/50 backdrop-blur-xs max-w-max">
          {item.content_type}
        </p>
      </div>
      <div className="flex items-start gap-5 w-full h-full">
        <div className="w-full space-y-5">
          <div className="space-y-2">
            <div className="space-y-1">
              <h3 className="font-bold text-xl text-tertiary">{item.title}</h3>
              <div className="flex items-center gap-5 text-xs">
                <p>{item.writer_name}</p>
                <p>{formatDate(item.createdAt)}</p>
              </div>
            </div>
            <div className="w-full overflow-hidden">
              <p className="line-clamp-3">{item.content}</p>
            </div>
          </div>

          <div className="flex gap-8 items-center text-sm">
            <div className="flex items-center gap-2">
              {" "}
              <LuHeart className="text-lg" /> <p>{item.like_count}</p>
            </div>
            <div className="flex items-center gap-2">
              {" "}
              <TfiCommentAlt className="text-lg" /> <p>{item.comment_count}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between items-center gap-5 h-full py-5">
          <BsThreeDotsVertical />
          <Bookmark />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
