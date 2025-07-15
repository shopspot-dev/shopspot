import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  linkTo?: string;
  linkText?: string;
}

export default function SectionHeader({ title, linkTo, linkText }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {linkTo && (
        <Link
          to={linkTo}
          className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium"
        >
          {linkText || 'View all'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      )}
    </div>
  );
}