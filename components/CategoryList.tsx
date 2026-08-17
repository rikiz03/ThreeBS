'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/lib/types';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import TranslatedText from './TranslatedText';

interface CategoryListProps {
    categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
    const { t } = useTranslation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            const { scrollLeft } = scrollContainerRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const current = scrollContainerRef.current;
        if (current) {
            current.addEventListener('scroll', handleScroll);
            handleScroll();
        }
        return () => {
            current?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const mockupCategories = [
        { id: 'mock-1', name: 'Electronics', subtitle: 'Latest gadgets', slug: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop' },
        { id: 'mock-2', name: 'Fashion', subtitle: 'Trending styles', slug: 'fashion', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop' },
        { id: 'mock-3', name: 'Home & Garden', subtitle: 'Décor & essentials', slug: 'home-garden', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=200&auto=format&fit=crop' },
        { id: 'mock-4', name: 'Beauty & Health', subtitle: 'Self-care picks', slug: 'beauty-health', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=200&auto=format&fit=crop' },
        { id: 'mock-5', name: 'Sports & Outdoors', subtitle: 'Stay active', slug: 'sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=200&auto=format&fit=crop' },
    ];

    const displayCategories = categories?.length > 0 ? categories : mockupCategories;

    return (
        <div className="relative mb-12 py-4 group/section" id="popular_categories_section">
            <div className="flex items-center justify-between mb-6 px-2">
                <div>
                    <h2 className="text-2xl font-black text-[#0E5B3D] tracking-tight"><TranslatedText text="Explore Categories" /></h2>
                    <p className="text-xs text-gray-500 font-bold mt-0.5"><TranslatedText text="Curated collections for every style" /></p>
                </div>
                <Link href="/category/deals" className="hidden sm:flex bg-[#74D644] text-[#0E5B3D] px-6 py-2.5 rounded-full text-xs font-black items-center hover:bg-lime-300 transition-all shadow-md group uppercase tracking-wider">
                    <TranslatedText text="See all" /> <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 -left-4 -right-4 flex items-center justify-between pointer-events-none z-20 hidden sm:flex">
                <div className="w-12 h-full flex items-center justify-start ml-1">
                    {showLeftArrow && (
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 bg-white border border-gray-100 rounded-full shadow-xl flex items-center justify-center text-[#0E5B3D] hover:bg-[#74D644] transition-all opacity-0 group-hover/section:opacity-100 pointer-events-auto"
                            aria-label="Scroll Left"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}
                </div>

                <div className="w-12 h-full flex items-center justify-end mr-1">
                    {showRightArrow && (
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 bg-white border border-gray-100 rounded-full shadow-xl flex items-center justify-center text-[#0E5B3D] hover:bg-[#74D644] transition-all opacity-0 group-hover/section:opacity-100 pointer-events-auto"
                            aria-label="Scroll Right"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Horizontal Flex Container (From Mockup) */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide py-3 px-2 scroll-smooth items-center"
            >
                {displayCategories.map((category: any, index: number) => (
                    <Link
                        key={category.id || index}
                        href={`/category/${category.slug}`}
                        className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 min-w-[220px] max-w-[260px] group transition-all duration-300 hover:-translate-y-1 hover:border-[#74D644]"
                    >
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform">
                            <Image
                                src={category.image || "https://placehold.co/200x200/png?text=Category"}
                                alt={category.name || "Category"}
                                fill
                                sizes="60px"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-black text-gray-900 group-hover:text-[#0E5B3D] transition-colors truncate">
                                <TranslatedText text={category.name} />
                            </span>
                            <span className="text-[11px] font-bold text-gray-400 truncate mt-0.5">
                                <TranslatedText text={category.subtitle || "New arrivals"} />
                            </span>
                        </div>
                    </Link>
                ))}

                {/* "See all" Pill Button (From Mockup) */}
                <Link
                    href="/category/deals"
                    className="flex items-center justify-center bg-[#74D644] text-[#0E5B3D] p-6 rounded-2xl shadow-sm hover:shadow-md min-w-[120px] h-[88px] group transition-all duration-300 hover:-translate-y-1 hover:bg-lime-300 font-black text-sm flex-shrink-0"
                >
                    <div className="flex flex-col items-center gap-1">
                        <TranslatedText text="See all" />
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
