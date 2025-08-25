"use client";
import React, { useState } from "react";
import { Demodata } from "@/assets/Demodata";
import TabComponent from "@/components/home-components/PostsCollection/TabComponent";
import GridPostCard from "@/components/home-components/PostsCollection/GridPostCard";
import PostCard from "@/components/home-components/PostsCollection/PostCard";

const ForYou = () => {
    const [gridMode, setGridMode] = useState(false);
    const [active, setActive] = useState(0);
    const desktopTabs = ["Recent", "Popular", "Following", "Liked", "Top Rated", "Bookmarked"]
    return (
        <div className="bg-white rounded-lg shadow-md pb-5 sm:pt-5">

            <div className="w-full relative sm:hidden block">
                <TabComponent
                    tabs={desktopTabs}
                    activeTab={active}
                    onTabChange={setActive}
                    gridMode={gridMode}
                    setGridMode={setGridMode}
                />
            </div>
            <div
                className={`grid ${gridMode ? "sm:grid-cols-3 grid-cols-1 gap-5" : "grid-cols-1 gap-4"
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

export default ForYou;
