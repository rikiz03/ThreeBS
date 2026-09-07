'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export default function HeroBanner() {
    return (
        <div className="mb-12 relative bg-[#0E5B3D] rounded-b-[40px] text-white px-6 sm:px-12 pt-12 pb-20 shadow-2xl overflow-hidden border-b border-[#74D644]/20">
            {/* Background Glows & Abstract Circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#74D644]/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse delay-700" />

            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Content */}
                    <div className="lg:col-span-7 z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-lime-300 text-xs font-black tracking-widest uppercase shadow-inner">
                            <ShoppingBag className="w-4 h-4 text-[#74D644]" />
                            Trending Products • Worldwide Shipping
                        </div>

                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
                            Shop the world <br />
                            <span className="text-[#74D644]">from your home</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-200 max-w-xl font-medium leading-relaxed">
                            Discover premium products sourced from global suppliers at up to <span className="text-[#74D644] font-bold">50% off retail</span>. Fast worldwide delivery to the US, Europe, and beyond.
                        </p>

                        <div className="pt-4 flex flex-wrap items-center gap-4">
                            <Link href="#products-section" className="bg-[#74D644] text-[#0E5B3D] px-8 py-4 rounded-full font-black text-lg hover:bg-lime-300 transition-all duration-300 shadow-lg hover:shadow-[#74D644]/50 flex items-center gap-3 group focus:outline-none focus:ring-4 focus:ring-lime-400">
                                Shop now 
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            
                            <div className="flex items-center gap-6 pl-4 text-sm font-bold text-gray-200">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-[#74D644]" />
                                    <span>Quality Guaranteed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-[#74D644]" />
                                    <span>Global Shipping</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image / Mockup Bag */}
                    <div className="lg:col-span-5 relative flex justify-center items-center z-10">
                        <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px] group">
                            {/* Decorative Outer Glow Ring */}
                            <div className="absolute inset-0 bg-[#74D644]/20 rounded-full blur-3xl group-hover:bg-[#74D644]/30 transition-all duration-500" />
                            
                            {/* Main Product Showcase Image */}
                            <Image
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
                                alt="Premium products delivered worldwide"
                                fill
                                priority
                                className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700"
                            />

                            {/* Floating Floating Price/Discount Badge */}
                            <div className="absolute top-10 -left-6 bg-white text-[#0E5B3D] p-4 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-3 animate-bounce duration-1000">
                                <div className="w-10 h-10 rounded-full bg-[#74D644]/20 flex items-center justify-center text-[#0E5B3D] font-black text-lg">
                                    %
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Global Sourcing</p>
                                    <p className="text-sm font-black text-[#0E5B3D]">Premium picks, fair prices</p>
                                </div>
                            </div>

                            {/* Floating Curated Badge */}
                            <div className="absolute bottom-10 -right-6 bg-[#581443] text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-[#74D644] animate-ping" />
                                <div>
                                    <p className="text-xs font-bold text-lime-300 uppercase tracking-widest">Curated</p>
                                    <p className="text-sm font-black">Top Global Brands</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
