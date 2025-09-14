import React from 'react';
interface CategoriesProps {
    data: string[];
}

const Categories = ({ data }: CategoriesProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-5">
            <ul className="flex flex-wrap gap-4 items-center">
                {data.map((category, index) => (
                    <li key={index} className="text-secondary text-xs font-semibold bg-hover px-3 py-2 rounded-2xl capitalize">
                        {category}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;