'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Minus, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { useCartStore, useSettingsStore, useSalesStore } from '@/lib/store';
import { getCurrencyInfo } from '@/lib/geo';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

interface PromoBannersProps {
    lightingProducts?: Product[];
    officeProducts?: Product[];
    gamingProducts?: Product[];
}

export default function PromoBanners({ lightingProducts = [], officeProducts = [], gamingProducts = [] }: PromoBannersProps) {
    const [activeTab, setActiveTab] = useState('Trending');
    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useCartStore((state) => state.removeItem);
    const cartItems = useCartStore((state) => state.items);
    const { currency } = useSettingsStore();
    const sales = useSalesStore((state) => state.sales);

    const tabs = ['Trending', 'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Gadgets', 'Accessories'];

    // Best selling products are derived from actual recorded sales only.
    // The section stays hidden until at least one real purchase has been made.
    const topBestSellers = Object.entries(sales)
        .map(([id, entry]) => ({ id, qty: entry.qty, product: entry.product }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 20);

    const hasSales = topBestSellers.length > 0;

    const { symbol, rate } = getCurrencyInfo(currency);
    const formatPriceParts = (price: number) => {
        const parts = (price * rate).toFixed(2).split('.');
        return { dollars: parts[0], cents: parts[1] };
    };

    return (
        <div className="space-y-16 py-8">
            {/* 1. 4-Column Promotional Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Card 1: Fitness & Gym — New Arrivals */}
                <div className="bg-[#0E5B3D] text-white rounded-3xl p-6 flex flex-col justify-between h-72 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="z-10 max-w-[155px]">
                        <p className="text-xs font-bold text-[#74D644] uppercase tracking-wider mb-1">New In</p>
                        <h3 className="text-4xl font-black mb-1 text-white leading-none">Fitness &amp; Gym</h3>
                        <p className="text-[11px] text-green-100 leading-snug font-medium mb-3">Fresh gear drops for your training goals</p>
                        <Link href="/category/fitness-gym" className="inline-flex items-center gap-1 text-[10px] font-black text-[#74D644] uppercase tracking-wider hover:gap-2 transition-all">
                            Shop now <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="absolute -right-3 -bottom-3 w-44 h-44 group-hover:scale-110 transition-transform duration-500">
                        <Image
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop"
                            alt="Fitness & Gym"
                            fill
                            className="object-contain opacity-90 drop-shadow-2xl"
                        />
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#74D644]/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                </div>

                {/* Card 2: Health & Beauty — Top Rated */}
                <div className="bg-[#581443] text-white rounded-3xl p-6 flex flex-col justify-between h-72 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="z-10 max-w-[155px]">
                        <p className="text-xs font-bold text-pink-300 uppercase tracking-wider mb-1">Top Rated</p>
                        <h3 className="text-4xl font-black mb-1 text-white leading-none">Health &amp; Beauty</h3>
                        <p className="text-[11px] text-pink-100 leading-snug font-medium mb-3">Customer favourites &amp; wellness essentials</p>
                        <Link href="/category/health-wellness" className="inline-flex items-center gap-1 text-[10px] font-black text-pink-300 uppercase tracking-wider hover:gap-2 transition-all">
                            Shop now <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="absolute -right-3 -bottom-3 w-44 h-44 group-hover:scale-110 transition-transform duration-500">
                        <Image
                            src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=300&auto=format&fit=crop"
                            alt="Health & Beauty"
                            fill
                            className="object-contain opacity-90 drop-shadow-2xl"
                        />
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                </div>

                {/* Card 3: Home & Lifestyle — Trending */}
                <div className="bg-[#C26D38] text-white rounded-3xl p-6 flex flex-col justify-between h-72 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="z-10 max-w-[155px]">
                        <p className="text-xs font-bold text-orange-200 uppercase tracking-wider mb-1">Trending</p>
                        <h3 className="text-4xl font-black mb-1 text-white leading-none">Home &amp; Living</h3>
                        <p className="text-[11px] text-orange-100 leading-snug font-medium mb-3">Most-loved picks to upgrade your space</p>
                        <Link href="/category/home-lifestyle" className="inline-flex items-center gap-1 text-[10px] font-black text-orange-200 uppercase tracking-wider hover:gap-2 transition-all">
                            Shop now <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="absolute -right-3 -bottom-3 w-44 h-44 group-hover:scale-110 transition-transform duration-500">
                        <Image
                            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300&auto=format&fit=crop"
                            alt="Home & Lifestyle"
                            fill
                            className="object-contain opacity-90 drop-shadow-2xl"
                        />
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                </div>

                {/* Card 4: Creator Studio — Best Sellers */}
                <div className="bg-[#1C3A5E] text-white rounded-3xl p-6 flex flex-col justify-between h-72 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="z-10 max-w-[155px]">
                        <p className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">Best Sellers</p>
                        <h3 className="text-4xl font-black mb-1 text-white leading-none">Creator Studio</h3>
                        <p className="text-[11px] text-blue-100 leading-snug font-medium mb-3">Top picks for content creators worldwide</p>
                        <Link href="/category/creator-studio" className="inline-flex items-center gap-1 text-[10px] font-black text-blue-300 uppercase tracking-wider hover:gap-2 transition-all">
                            Shop now <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="absolute -right-3 -bottom-3 w-44 h-44 group-hover:scale-110 transition-transform duration-500">
                        <Image
                            src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=300&auto=format&fit=crop"
                            alt="Creator Studio gear"
                            fill
                            className="object-contain opacity-90 drop-shadow-2xl"
                        />
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                </div>

            </div>

            {/* 2. Best Selling Items Section (hidden until real sales exist) */}
            {hasSales && (
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-black text-[#0E5B3D] tracking-tight">Best selling items</h2>
                    <Link href="/category/deals" className="text-xs font-black text-[#0E5B3D] hover:text-[#74D644] transition-colors flex items-center gap-1 uppercase tracking-wider self-start sm:self-auto">
                        See more <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Pill Tabs */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6 items-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-300 shadow-sm ${
                                activeTab === tab
                                    ? 'bg-[#0E5B3D] text-white shadow-md scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Mini Product Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {topBestSellers.map(({ product: p }) => {
                        const count = cartItems.filter(item => item.id === p.id).length;
                        const priceParts = formatPriceParts(p.price);

                        return (
                            <div key={p.id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group">
                                <Link href={`/product/${p.id}`} className="relative aspect-square mb-3 rounded-2xl overflow-hidden bg-[#F8FAFC] flex justify-center items-center p-3 group-hover:bg-[#74D644]/5 transition-colors">
                                    <Image
                                        src={p.image}
                                        alt={p.title}
                                        fill
                                        sizes="150px"
                                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                </Link>

                                <div className="flex flex-col flex-1 px-1">
                                    <Link href={`/product/${p.id}`} className="block mb-2">
                                        <h4 className="text-xs font-black text-gray-900 line-clamp-2 group-hover:text-[#0E5B3D] transition-colors leading-snug">
                                            {p.title}
                                        </h4>
                                        <span className="text-[10px] font-bold text-gray-400 mt-1 block">Free shipping</span>
                                    </Link>

                                    <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-gray-50">
                                        <div className="flex items-start text-gray-900 font-black">
                                            <span className="text-[10px] leading-none pt-0.5 mr-0.5">{symbol}</span>
                                            <span className="text-lg leading-none">{priceParts.dollars}</span>
                                            <span className="text-[10px] leading-none pt-0.5">.{priceParts.cents}</span>
                                        </div>

                                        <div>
                                            {count > 0 ? (
                                                <div className="flex items-center gap-2 bg-[#74D644] text-[#0E5B3D] px-2.5 py-1 rounded-full shadow font-black text-[11px]">
                                                    <button 
                                                        onClick={() => removeItem(p.id)} 
                                                        className="w-4 h-4 rounded-full bg-white/50 hover:bg-white flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus className="w-2.5 h-2.5" />
                                                    </button>
                                                    <span>{count}</span>
                                                    <button 
                                                        onClick={() => addItem({ id: p.id, title: p.title, price: p.price, image: p.image, rating: 5, reviews: 10, category: p.category, allCategories: [p.category], description: 'Premium product', supplier: 'UNKNOWN', externalId: p.id })} 
                                                        className="w-4 h-4 rounded-full bg-white/50 hover:bg-white flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus className="w-2.5 h-2.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => addItem({ id: p.id, title: p.title, price: p.price, image: p.image, rating: 5, reviews: 10, category: p.category, allCategories: [p.category], description: 'Fresh product', supplier: 'Local', externalId: p.id })} 
                                                    className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#74D644] text-gray-600 hover:text-[#0E5B3D] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow group-hover:bg-[#74D644] group-hover:text-[#0E5B3D]"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            )}

            {/* 3a. Lighting & Electrical Section */}
            <div className="mb-16">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div>
                        <h2 className="text-2xl font-black text-[#0E5B3D] tracking-tight">Lighting &amp; Electrical</h2>
                        <p className="text-xs text-gray-500 font-bold mt-0.5">Brighter spaces &amp; essential power</p>
                    </div>
                    <Link href="/category/lighting-electrical" className="text-xs font-black text-[#0E5B3D] hover:text-[#74D644] transition-colors flex items-center gap-1 uppercase tracking-wider">
                        See more <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                {lightingProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {lightingProducts.slice(0, 10).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm border border-gray-100">
                        Lighting &amp; electrical items are on their way. Check back soon!
                    </div>
                )}
            </div>

            {/* 3b. Office & Business Items Section */}
            <div className="mb-16">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div>
                        <h2 className="text-2xl font-black text-[#0E5B3D] tracking-tight">Office &amp; Business Items</h2>
                        <p className="text-xs text-gray-500 font-bold mt-0.5">Everything your workspace needs</p>
                    </div>
                    <Link href="/category/office-business" className="text-xs font-black text-[#0E5B3D] hover:text-[#74D644] transition-colors flex items-center gap-1 uppercase tracking-wider">
                        See more <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                {officeProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {officeProducts.slice(0, 10).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm border border-gray-100">
                        Office &amp; business items are on their way. Check back soon!
                    </div>
                )}
            </div>

            {/* 3c. Gaming & Fun Items Section */}
            <div className="mb-16">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div>
                        <h2 className="text-2xl font-black text-[#0E5B3D] tracking-tight">Gaming &amp; Fun Items</h2>
                        <p className="text-xs text-gray-500 font-bold mt-0.5">Level up playtime &amp; entertainment</p>
                    </div>
                    <Link href="/category/gaming-fun" className="text-xs font-black text-[#0E5B3D] hover:text-[#74D644] transition-colors flex items-center gap-1 uppercase tracking-wider">
                        See more <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                {gamingProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {gamingProducts.slice(0, 10).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm border border-gray-100">
                        Gaming &amp; fun items are on their way. Check back soon!
                    </div>
                )}
            </div>
        </div>
    );
}
