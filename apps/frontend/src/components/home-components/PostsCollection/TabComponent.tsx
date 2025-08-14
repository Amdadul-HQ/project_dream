'use client'
import { useState } from "react";
import { CiGrid2H } from "react-icons/ci";
import { MdCheckBoxOutlineBlank } from "react-icons/md";

const tabs = [
  "Recent",
  "Trending",
  "Following",
  "Liked",
  "Top picks"
];

export default function TabComponent() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
      {/* Tabs container with horizontal scroll on mobile */}
      <div className="flex gap-2 sm:gap-4 lg:gap-6 overflow-x-auto w-full sm:w-auto scrollbar-hide">
        <div className="flex flex-wrap md:flex-nowrap gap-2 sm:gap-4 lg:gap-6 md:min-w-max">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActive(idx)}
              className={`px-2 sm:px-3 py-1 text-sm sm:text-base font-medium rounded-lg transition-colors whitespace-nowrap
                ${active === idx
                  ? "bg-hover text-tertiary"
                  : "text-secondary hover:text-tertiary"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {/* View toggle buttons */}
      <div className="flex gap-2 shrink-0">
        <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center bg-hover justify-center rounded-md border border-gray-200 text-secondary hover:bg-hover transition-colors">
          <CiGrid2H className="font-semibold text-lg sm:text-xl" />
        </button>
        <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md border border-gray-200 text-secondary hover:bg-hover transition-colors">
          <MdCheckBoxOutlineBlank className="font-semibold text-lg sm:text-xl" />
        </button>
      </div>
    </div>
  );
}