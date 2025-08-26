"use client";
import { CiGrid2H } from "react-icons/ci";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


interface TabComponentProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
  gridMode: boolean;
  setGridMode: (mode: boolean) => void;
}

export default function TabComponent({ gridMode, setGridMode, tabs }: TabComponentProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
      {/* Tabs using shadcn */}
      <Tabs defaultValue={tabs[0]} className="w-full">
        <ScrollArea>
          <div className="w-full relative h-10">
            <TabsList className="flex absolute h-10">
              {tabs.map((tab, id) => (
                <TabsTrigger key={id} value={tab}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab}>
            {/* Render children or dynamic content here */}
            <p className="text-sm text-gray-600">Content for {tab}</p>
          </TabsContent>
        ))}
      </Tabs>

      {/* View toggle buttons */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setGridMode(false)}
          className={`${gridMode ? "bg-white" : "bg-hover"
            } w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md border border-gray-200 text-secondary hover:bg-hover transition-colors`}
        >
          <CiGrid2H className="font-semibold text-lg sm:text-xl" />
        </button>
        <button
          onClick={() => setGridMode(true)}
          className={`${gridMode ? "bg-hover" : "bg-white"
            } w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md border border-gray-200 text-secondary hover:bg-hover transition-colors`}
        >
          <MdCheckBoxOutlineBlank className="font-semibold text-lg sm:text-xl" />
        </button>
      </div>
    </div>
  );
}
