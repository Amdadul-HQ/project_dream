import PostCollections from "@/components/home-components/PostsCollection/PostCollections";
import RightsideLayout from "@/components/home-components/RighsideLayout/RightsideLayout";
import SliderSection from "@/components/home-components/SliderSection";

const Home =() => {
  return (
    <div className="">
      <SliderSection />
      <div className="flex items-start gap-5 lg:px-5">
        <div className="lg:w-3/4">
          <PostCollections />
        </div>
        <div className="hidden lg:block lg:w-1/4">
          <RightsideLayout />
        </div>
      </div>
    </div>
  );
}

export default Home
