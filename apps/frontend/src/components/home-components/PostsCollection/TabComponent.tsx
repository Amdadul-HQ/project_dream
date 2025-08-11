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
    <div className="flex items-center justify-between px-8 py-5">
      <div className="flex gap-6">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActive(idx)}
            className={`px-2 py-1 text-base font-medium rounded-lg transition-colors
              ${active === idx
                ? "bg-hover text-tertiary"
                : "text-secondary"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="w-8 h-8 flex items-center bg-hover justify-center rounded-md border border-gray-200 text-secondary hover:bg-hover">
          <CiGrid2H className="font-semibold text-xl" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-secondary hover:bg-hover">
          <MdCheckBoxOutlineBlank className="font-semibold text-xl" />
        </button>
      </div>
    </div>
  );
}