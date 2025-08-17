"use client";
import React, { useState } from "react";
import { Demodata } from "@/assets/Demodata";
import PostCard from "./PostCard";
import TabComponent from "./TabComponent";
import GridPostCard from "./GridPostCard";

const PostCollections = () => {
  const [gridMode, setGridMode] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-md pb-5">
      <TabComponent gridMode={gridMode} setGridMode={setGridMode} />
      <div
        className={`grid ${
          gridMode ? "sm:grid-cols-3 grid-cols-1 gap-5" : "grid-cols-1 gap-4"
        } px-5 w-full`}
      >
        {Demodata.map((item, index) =>
          gridMode ? (
            <GridPostCard key={index} item={item} />
          ) : (
            <PostCard key={index} item={item} />
          )
        )}
      </div>
    </div>
  );
};

export default PostCollections;
