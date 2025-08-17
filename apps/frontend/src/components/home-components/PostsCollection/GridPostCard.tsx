import { Bookmark } from "lucide-react";
import Image from "next/image";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuHeart } from "react-icons/lu";
import { TfiCommentAlt } from "react-icons/tfi";
import demoUserImg from "@/assets/user.jpg";

const GridPostCard = ({ item }: { item: any }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return `${day} ${month}`;
  };
  return (
    <div className="text-secondary py-2 p-4 rounded-md justify-between items-start flex flex-col hover:bg-gray-100 bg-gray-100 transition-colors duration-200 ease-in-out">
      <div className="flex w-full justify-between">
      <div className="flex items-center gap-x-2">
        <div className="">
        <Image alt="Writer" src={demoUserImg} className="w-[34px] h-[34px] rounded-full "/>
        </div>
        <div>
            <h3 className="font-bold text-sm">{item.writer_name}</h3>
            <p className="text-xs">{`@${item.writer_name.toLocaleLowerCase().split(" ").join("")}`}</p>
        </div>
      </div>
        <div className="flex justify-between items-center h-full py-5">
          {/* <Bookmark /> */}
          <BsThreeDotsVertical />
        </div>
      </div>

    <div className="flex sm:flex-col-reverse flex-row">
      <div className="flex gap-5 w-full">
        <div className="w-full flex flex-col justify-between h-full">
          <div className="space-y-1 space-x-0.5">
            <div className="space-y-1">
              <h3 className="font-bold sm:text-xl text-lg text-tertiary md:mt-5 text-black">{item.title}</h3>
              <div className="flex items-center gap-5 text-xs">
              </div>
            </div>
            <div className="w-full overflow-hidden">
              <p className="line-clamp-3">{item.content}</p>
            </div>
          </div>

          <div className="flex gap-8 items-center text-sm md:mt-2">
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
      </div>
      <div className="relative">
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
    </div>
    </div>
  );
};

export default GridPostCard;
