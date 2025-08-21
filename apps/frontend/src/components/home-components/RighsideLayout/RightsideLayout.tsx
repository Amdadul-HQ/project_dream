import BookMarkPosts from "./BookMarkPosts";
import Categories from "./Categories";
import SocialMedia from "./SocialMedia";
import TopPicks from "./TopPicks";
import { Demodata } from "@/assets/Demodata";
import TopWritters from "./TopWritters";

const RightsideLayout = () => {

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      return `${day} ${month}`;
    };
    const itemData = Demodata.slice(0, 5).map(item => ({
        title: item.title,
        writer_name: item.writer_name,
        formattedDate: formatDate(item.createdAt)
    }));

    const categories = Demodata.map(item => item.content_type);
    const topwritters = Demodata.slice(0, 5).map(item => item.writer_name);

    return (
        <div className="space-y-5">
            <TopPicks data={itemData} />
            <Categories data={categories} />
            <BookMarkPosts data={itemData} />
            <SocialMedia />
            <TopWritters data={topwritters} />
        </div>
    );
};

export default RightsideLayout;