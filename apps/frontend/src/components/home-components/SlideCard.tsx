import Image from "next/image";

interface SliderCardProps {
  item: {
    title: string;
    writer_name: string;
    image: any;
    createdAt: string;
  };
  isActive?: boolean;
}

const SliderCard = ({ item, isActive = false }: SliderCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return `${day} ${month}`;
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all duration-300 `}
    >
      <div className="relative h-52 lg:h-56 rounded-xl">
        <Image
          src={item.image.src}
          alt={item.title}
          width={500}
          height={300}
          className=" h-full object-cover rounded-xl"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-black/50 backdrop-blur-xs">
          <h3 className="text-sm sm:text-base font-semibold mb-1 truncate leading-tight overflow-hidden">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            {item.writer_name} • {formatDate(item.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SliderCard;
