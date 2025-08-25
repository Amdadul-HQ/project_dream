import AudioPostCard from "./AudioPostCard"

// Sample data with both regular and audio posts
const samplePosts = [
  {
    image: { src: "/podcast-cover-art.png" },
    title: "The Future of AI in Music Production",
    content_type: "audio",
    writer_name: "Sarah Johnson",
    createdAt: "2024-01-15",
    content:
      "In this episode, we explore how artificial intelligence is revolutionizing music production, from automated mixing to AI-generated compositions. Join us as we discuss the latest trends and tools.",
    like_count: 234,
    comment_count: 45,
    audio: {
      src: "/placeholder.mp3",
      duration: "15:32",
    },
  },
//   {
//     image: { src: "/tech-article-thumbnail.png" },
//     title: "Building Scalable React Applications",
//     content_type: "article",
//     writer_name: "Mike Chen",
//     createdAt: "2024-01-14",
//     content:
//       "Learn the best practices for building large-scale React applications that can grow with your team and user base. We'll cover architecture patterns, state management, and performance optimization.",
//     like_count: 156,
//     comment_count: 23,
//   },
  {
    image: { src: "/meditation-audio-cover.png" },
    title: "Daily Meditation: Finding Inner Peace",
    content_type: "audio",
    writer_name: "Emma Wilson",
    createdAt: "2024-01-13",
    content:
      "A guided meditation session to help you start your day with clarity and focus. This 10-minute practice combines breathing techniques with mindfulness exercises.",
    like_count: 89,
    comment_count: 12,
    audio: {
      src: "/placeholder.mp3",
      duration: "10:45",
    },
  },
//   {
//     image: { src: "/cooking-video-thumbnail.png" },
//     title: "Quick and Healthy Breakfast Ideas",
//     content_type: "video",
//     writer_name: "Chef Rodriguez",
//     createdAt: "2024-01-12",
//     content:
//       "Start your morning right with these nutritious and delicious breakfast recipes that take less than 15 minutes to prepare. Perfect for busy weekdays!",
//     like_count: 312,
//     comment_count: 67,
//   },
]

export default function AudioPostCollections() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Feed</h1>
          <p className="text-gray-600">Discover articles, audio content, and more from our community</p>
        </div>

        <div className="space-y-6">
          {samplePosts.map((post, index) => (
            <AudioPostCard key={index} item={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
