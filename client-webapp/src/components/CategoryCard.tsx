import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = (Icons as any)[category.icon];

  return (
    <Link to={`/categories/${category.id}`} className="relative group cursor-pointer">
      <div className="relative h-40 w-full overflow-hidden rounded-lg">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center">
        {IconComponent && <IconComponent className="h-6 w-6 text-white mr-2" />}
        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
      </div>
    </Link>
  );
}