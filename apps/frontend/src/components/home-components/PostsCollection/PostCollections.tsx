import React from 'react';
import { Demodata } from '@/assets/Demodata';
import PostCard from './PostCard';

const PostCollections = () => {
    return (
        <div className='grid grid-cols-1 gap-4 px-5 w-full'>
            {Demodata.map((item, index) => (
                <PostCard key={index} item={item} />
            ))}
        </div>
    );
};

export default PostCollections;