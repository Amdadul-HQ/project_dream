import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const PostCard = ({ item }: { item: any }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        return `${day} ${month}`;
      };
    return (
        <div className='flex items-start gap-4 w-full p-4 bg-white rounded-md'>
            <div className='w-[250px] h-[152px] rounded-md relative'>
                <Image className='rounded-md' src={item.image.src} alt={item.title} width={250} height={152} />
                <p className='absolute top-1 left-1  px-2 py-1 rounded-2xl text-white text-xs capitalize bg-black/50 backdrop-blur-xs max-w-max'>{item.content_type}</p>
            </div>
            <div className='w-full space-y-2'>
                <h3 className='font-bold text-xl'>{item.title}</h3>
                <div className='flex items-center gap-5 text-sm'>
                <p>{item.writer_name}</p>
                <p>{formatDate(item.createdAt)}</p>
                </div>
                <div className='w-full'>
                    <p>{item.content}</p>
                </div>
                <div className='flex gap-5 items-center justify-between w-full'>
                    <div className='flex gap-5 items-center'>
                    <div className='flex items-center gap-2'> <Heart/> <p>{item.like_count}</p></div>
                    <div className='flex items-center gap-2'> <MessageCircle/> <p>{item.comment_count}</p></div>
                    </div>
                    <Bookmark/>
                </div>
            </div>
        </div>
    );
};

export default PostCard;