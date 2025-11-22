import React, { useRef, useState } from 'react';
import { CATEGORIES } from '../constants';

interface CategoryNavProps {
  selectedCategory: string;
  language: 'ar' | 'en';
  onSelectCategory: (id: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory, language, onSelectCategory }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Scroll speed
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div className="relative group">
      <div className={`absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none dark:from-dark transition-colors duration-300`} />
      <div className={`absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none dark:from-dark transition-colors duration-300`} />
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto py-4 px-4 no-scrollbar cursor-grab active:cursor-grabbing scroll-smooth"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <button
            onClick={() => onSelectCategory('all')}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 border
              ${selectedCategory === 'all'
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'}
            `}
          >
            <span className="font-bold text-sm">{language === 'ar' ? 'الكل' : 'All'}</span>
          </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 border select-none
              ${selectedCategory === cat.id
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'}
            `}
          >
            <span>{cat.icon}</span>
            <span className="font-bold text-sm">{language === 'ar' ? cat.name : cat.nameEn}</span>
          </button>
        ))}
      </div>
    </div>
  );
};