"use client";
import React, { useState } from "react";
import { Demodata } from "@/assets/Demodata";
import PostCard from "./PostCard";
import GridPostCard from "./GridPostCard";
import TabComponent from "./TabComponent";

const PostCollections = () => {
  const [gridMode, setGridMode] = useState(false);
  const [active, setActive] = useState(0);
  const tabs = ["All", "Horror", "Islamic", "Science", "Mystery", "Thriller", "Adventure", "Historical", "Biography", "Drama"]
  const desktopTabs = ["Recent", "Popular", "Following","Liked","Top Rated","Bookmarked"]
  return (
    <div className="bg-white rounded-lg shadow-md pb-5">
          <div className="w-full relative sm:hidden block">
            <TabComponent
          tabs={tabs}
          activeTab={active}
          onTabChange={setActive}
          gridMode={gridMode}
          setGridMode={setGridMode}
          />
          </div>
          <div className="w-full relative sm:block hidden">
            <TabComponent
          tabs={desktopTabs}
          activeTab={active}
          onTabChange={setActive}
          gridMode={gridMode}
          setGridMode={setGridMode}
          />
          </div>
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
