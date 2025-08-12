import demoUserImg from "@/assets/user.jpg";
import Image from "next/image";
type TopWritterProps = {
    data: string[];
};

const TopWritters = ({data}: TopWritterProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-5 space-y-5">
            <h1 className="text-xl font-semibold text-purple-800">Top Writers</h1>
            {data.map((writer, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Image src={demoUserImg} alt={writer} className="w-8 h-8 rounded-full" />
                    <p className="text-base text-secondary">{writer}</p>
                </div>
            ))}
        </div>
    );
};

export default TopWritters;
