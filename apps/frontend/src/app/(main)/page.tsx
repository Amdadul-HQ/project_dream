import { SliderSection } from "@/components/home-components/SliderSection";
import PostCollections from "@/components/home-components/PostsCollection/PostCollections";

export default function Home() {
    return (
      <div className=" ">
       <SliderSection />
       <PostCollections />
      </div>
    );
  }