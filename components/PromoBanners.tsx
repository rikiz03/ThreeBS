'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Minus, ChevronRight, Star } from 'lucide-react';
import { useCartStore } from '@/lib/store';

export default function PromoBanners() {
    const [activeTab, setActiveTab] = useState('Trending');
    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useCartStore((state) => state.removeItem);
    const cartItems = useCartStore((state) => state.items);

    const tabs = ['Trending', 'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Gadgets', 'Accessories'];

    const bestSellingProducts = [
        { id: 'best-1', title: 'Wireless Bluetooth Earbuds', price: 24.99, image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?q=80&w=200&auto=format&fit=crop', category: 'Electronics' },
        { id: 'best-2', title: 'Smart Fitness Watch', price: 39.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop', category: 'Electronics' },
        { id: 'best-3', title: 'Minimalist Backpack', price: 29.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=200&auto=format&fit=crop', category: 'Fashion' },
        { id: 'best-4', title: 'LED Desk Lamp', price: 18.99, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', category: 'Home & Living' },
        { id: 'best-5', title: 'Phone Case Premium', price: 12.99, image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=200&auto=format&fit=crop', category: 'Accessories' },
    ];

    const formatPriceParts = (price: number) => {
        const parts = price.toFixed(2).split('.');
        return { dollars: parts[0], cents: parts[1] };
    };

    return (
        <div className="space-y-16 py-8">
            {/* 1. 4-Column Promotional Cards Grid (From Mockup) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Save $29 */}
                <div className="bg-[#581443] text-white rounded-3xl p-6 flex flex-col justify-between h-72 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="z-10 max-w-[160px]">
                        <p className="text-xs font-bold text-pink-300 uppercase tracking-wider mb-1">Save</p>
                        <h3 className="text-4xl font-black mb-3 text-white">$29</h3>
                        <p className="text-xs text-gray-200 leading-snug font-medium">Discover deals on trending products & top brands</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-40 h-40 group-hover:scale-110 transition-transform duration-500">
                        <Image
                            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300&auto=format&fit=crop"
                            alt="Flour carton"
                            fill
                            className="object-contain opacity-90 drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* Card 2: Discount 30% */}
                <div className="bg-[#C26D38] text-white rounded-3xl p-6 flex flex-col justify-between h-72 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="z-10 max-w-[160px]">
                        <p className="text-xs font-bold text-orange-200 uppercase tracking-wider mb-1">Discount</p>
                        <h3 className="text-4xl font-black mb-3 text-white">30%</h3>
                        <p className="text-xs text-gray-200 leading-snug font-medium">Discover deals on trending products & top brands</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-40 h-40 group-hover:scale-110 transition-transform duration-500">
                        <Image
                            src="https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=300&auto=format&fit=crop"
                            alt="Peanut butter"
                            fill
                            className="object-contain opacity-90 drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* Card 3: Up to 50% */}
                <div className="bg-[#1C5282] text-white rounded-3xl p-6 flex flex-col justify-between h-72 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="z-10 max-w-[160px]">
                        <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Up to</p>
                        <h3 className="text-4xl font-black mb-3 text-white">50%</h3>
                        <p className="text-xs text-gray-200 leading-snug font-medium">Discover deals on trending products & top brands</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-40 h-40 group-hover:scale-110 transition-transform duration-500">
                        <Image
                            src="https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=300&auto=format&fit=crop"
                            alt="Skippy peanut butter"
                            fill
                            className="object-contain opacity-90 drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* Card 4: Free SHIP */}
                <div className="bg-[#552C85] text-white rounded-3xl p-6 flex flex-col justify-between h-72 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="z-10 max-w-[160px]">
                        <p className="text-xs font-bold text-purple-200 uppercase tracking-wider mb-1">Free</p>
                        <h3 className="text-4xl font-black mb-3 text-white">SHIP</h3>
                        <p className="text-xs text-gray-200 leading-snug font-medium">Discover deals on trending products & top brands</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-40 h-40 group-hover:scale-110 transition-transform duration-500">
                        <Image
                            src="https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?q=80&w=300&auto=format&fit=crop"
                            alt="Organic corn"
                            fill
                            className="object-contain opacity-90 drop-shadow-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Weekly Best Selling Items Section (From Mockup) */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-black text-[#0E5B3D] tracking-tight">Weekly best selling items</h2>
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
                    {bestSellingProducts.map((p) => {
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
                                            <span className="text-lg leading-none">{priceParts.dollars}</span>
                                            <span className="text-[10px] leading-none pt-0.5">.{priceParts.cents}$</span>
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

            {/* 3. Full-Width Bottom App Download Banner (From Mockup) */}
            <div className="bg-[#581443] rounded-[36px] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 border border-white/10">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

                <div className="z-10 max-w-xl space-y-6 text-center lg:text-left">
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                        Shop Anytime, Get <br />
                        Premium Products From <br />
                        <span className="text-[#74D644]">Around the World!</span>
                    </h2>
                    <p className="text-gray-200 text-base sm:text-lg font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                        Download our app for exclusive deals, order tracking, and a seamless shopping experience. Shipping to US, Europe & worldwide.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
<Link href="/#products-section" className="bg-black/40 hover:bg-black/60 border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg group">
                            <Image src="https://placehold.co/30x30/png?text=GP" alt="Google Play" width={28} height={28} className="rounded-md" />
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold leading-none">Get it on</p>
                                <p className="text-sm font-black text-white leading-tight mt-0.5">Google Play</p>
                            </div>
                        </Link>
<Link href="/#products-section" className="bg-black/40 hover:bg-black/60 border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg group">
                            <Image src="https://placehold.co/30x30/png?text=AS" alt="App Store" width={28} height={28} className="rounded-md" />
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold leading-none">Download on the</p>
                                <p className="text-sm font-black text-white leading-tight mt-0.5">App Store</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Delivery Person Illustration */}
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 z-10 flex-shrink-0">
                    <Image
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop"
                        alt="Happy customer with shopping bags"
                        fill
                        className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]"
                    />
                </div>
            </div>
        </div>
    );
}
