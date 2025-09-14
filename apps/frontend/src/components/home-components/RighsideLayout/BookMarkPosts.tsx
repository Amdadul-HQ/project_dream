

type BookMarkPosts = {
    title: string;
    writer_name: string;
    formattedDate: string;
};

type BookMarkPostsProps = {
    data: BookMarkPosts[];
};

const BookMarkPosts = ({ data }: BookMarkPostsProps) => {
    return (
        <div className="grid grid-cols-1 gap-5 p-5 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-semibold text-purple-800">Bookmarked Posts</h1>
            {data.map((item: BookMarkPosts, index: number) => (
                <div className="space-y-1" key={index}>
                    <h3 className="text-secondary text-md truncate overflow-hidden line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-ternary">
                        <p>{item.writer_name}</p>
                        <p>{item.formattedDate}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookMarkPosts;