'use client';

import { Search, ShoppingCart, User, MapPin, Menu, ChevronDown, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useCartStore, useSettingsStore } from '@/lib/store';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import LogoIcon from './LogoIcon';

export default function Header() {
    const cartItems = useCartStore((state) => state.items);
    const { locale, currency, setLocale, setCurrency, initializeSettings } = useSettingsStore();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [mounted, setMounted] = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (mounted && !localStorage.getItem('settings-storage')) {
            initializeSettings();
        }

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('[data-dropdown-component]')) {
                if (showCategories) setShowCategories(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [mounted, initializeSettings, showCategories]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <header className="w-full bg-[#0E5B3D] text-white shadow-md sticky top-0 z-50">
            {/* Top Bar */}
            <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-2 flex justify-between items-center text-xs text-gray-200">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 cursor-pointer hover:text-lime-300 transition-colors">
                            <MapPin className="w-3.5 h-3.5 text-[#74D644]" />
                            {t('deliver_to')} <SignedIn>User</SignedIn><SignedOut>Guest</SignedOut>
                        </span>
                        <span className="hidden sm:flex items-center gap-1 text-gray-300">
                            <Clock className="w-3.5 h-3.5 text-[#74D644]" />
                            Worldwide Shipping • US & Europe Express
                        </span>
                    </div>
                    <div className="flex items-center gap-4 hidden md:flex">
                        <select
                            aria-label="Select Currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="bg-transparent border-none outline-none cursor-pointer hover:text-lime-300 focus-visible:ring-2 focus-visible:ring-lime-300 rounded text-white"
                        >
                            <option value="USD" className="text-black">USD ($)</option>
                            <option value="GBP" className="text-black">GBP (£)</option>
                            <option value="EUR" className="text-black">EUR (€)</option>
                            <option value="CAD" className="text-black">CAD (C$)</option>
                            <option value="AUD" className="text-black">AUD (A$)</option>
                            <option value="NGN" className="text-black">NGN (₦)</option>
                        </select>

                        <select
                            aria-label="Select Language"
                            value={locale}
                            onChange={(e) => setLocale(e.target.value)}
                            className="bg-transparent border-none outline-none cursor-pointer hover:text-lime-300 focus-visible:ring-2 focus-visible:ring-lime-300 rounded text-white"
                        >
                            <option value="en" className="text-black">English</option>
                            <option value="es" className="text-black">Español</option>
                            <option value="fr" className="text-black">Français</option>
                        </select>

                        <span 
                            className="cursor-pointer hover:text-lime-300 transition-colors"
                            onClick={() => {
                                if ((window as any).Tawk_API) {
                                    (window as any).Tawk_API.maximize();
                                }
                            }}
                        >
                            Customer Care 24/7
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-6 lg:gap-8">
                    {/* Logo / Brand Name */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
                        <LogoIcon size={40} strokeColor="#74D644" fillColor="#0E5B3D" className="group-hover:scale-105 transition-transform" />
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight leading-none text-white group-hover:text-[#74D644] transition-colors">
                                Three Brothers Stores
                            </span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-3xl relative hidden md:block">
                        <input
                            type="text"
                            aria-label="Search products"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for trending products, gadgets, fashion & more..."
                            className="w-full pl-6 pr-32 py-3.5 rounded-full bg-white text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-[#74D644]/30 focus:outline-none transition-all shadow-lg text-sm font-medium"
                        />
                        <button type="submit" aria-label="Search" className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#0E5B3D] text-white font-bold rounded-full hover:bg-[#0b4830] transition-colors shadow-md text-xs tracking-wider uppercase">
                            Search
                        </button>
                    </form>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4 lg:gap-6">
                        {/* Delivery Time Badge (From Mockup) */}
                        <div className="hidden lg:flex items-center gap-3 bg-black/20 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-[#74D644] animate-ping" />
<span className="text-xs font-bold text-lime-300">Worldwide shipping included!</span>
                        </div>

                        {/* Auth Button */}
                        <div className="flex items-center gap-2 cursor-pointer hover:text-[#74D644] transition-colors hidden sm:flex">
                            <div className="p-2.5 bg-white/10 rounded-full text-white backdrop-blur-sm">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col text-sm">
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="text-left font-bold text-white hover:text-[#74D644] transition-colors">{t('sign_in')}</button>
                                    </SignInButton>
                                </SignedOut>
                                <SignedIn>
                                    <div className="flex items-center gap-3">
                                        <Link href="/admin" className="text-xs font-bold text-[#74D644] hover:text-white transition-colors border border-[#74D644]/40 rounded-full px-3 py-1.5">
                                            Admin
                                        </Link>
                                        <UserButton />
                                    </div>
                                </SignedIn>
                            </div>
                        </div>

                        {/* Cart Button */}
                        <Link href="/checkout" aria-label="Shopping Cart" className="relative cursor-pointer group focus:outline-none">
                            <div className="p-3 bg-[#74D644] rounded-full relative text-[#0E5B3D] shadow-lg group-hover:scale-105 transition-transform duration-300">
                                <ShoppingCart className="w-5 h-5" />
                                {mounted && cartItems.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0E5B3D] shadow-md animate-bounce">
                                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* Mobile Hamburger */}
                        <button 
                            data-dropdown-component="true"
                            aria-label="Toggle Navigation Menu"
                            aria-expanded={showCategories}
                            className="md:hidden p-2.5 bg-white/10 rounded-full text-white focus:outline-none"
                            onClick={() => setShowCategories(!showCategories)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="mt-4 md:hidden">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            aria-label="Search products"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for products, deals & more..."
                            className="w-full pl-5 pr-24 py-3 rounded-full bg-white text-gray-900 placeholder-gray-400 focus:outline-none text-sm shadow-md"
                        />
                        <button type="submit" aria-label="Search" className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#0E5B3D] text-white font-bold rounded-full text-xs uppercase shadow">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Mobile Categories Dropdown */}
            {showCategories && (
                <div data-dropdown-component="true" className="md:hidden absolute top-full left-0 right-0 bg-[#0E5B3D] border-t border-white/10 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="container mx-auto px-4 py-4 space-y-3">
                        <Link href="/" className="block text-sm font-bold text-white hover:text-[#74D644]" onClick={() => setShowCategories(false)}>Home</Link>
                        {[
                            { name: 'Electronics', slug: 'electronics' },
                            { name: 'Fashion', slug: 'fashion' },
                            { name: 'Home & Garden', slug: 'home-garden' },
                            { name: 'Beauty & Health', slug: 'beauty-health' },
                            { name: 'Sports & Outdoors', slug: 'sports' },
                            { name: 'Toys & Hobbies', slug: 'toys' },
                            { name: 'Deals & Offers', slug: 'deals' }
                        ].map((cat) => (
                            <Link 
                                key={`mobile-${cat.slug}`} 
                                href={`/category/${cat.slug}`}
                                className="block text-sm text-gray-200 hover:text-[#74D644] font-medium"
                                onClick={() => setShowCategories(false)}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Department Navigation Bar */}
            <div className="border-t border-white/10 hidden md:block bg-black/10 backdrop-blur-sm">
                <div className="container mx-auto px-4 relative">
                    <div className="flex items-center gap-8 py-3 text-sm font-bold text-gray-100">
                        <Link href="/" className="hover:text-[#74D644] transition-colors flex items-center gap-1">
                            Home
                        </Link>
                        <button 
                            data-dropdown-component="true"
                            aria-label="Toggle All Departments Menu"
                            aria-expanded={showCategories}
                            className="flex items-center gap-2 cursor-pointer hover:text-[#74D644] transition-colors py-1 focus:outline-none group"
                            onClick={() => setShowCategories(!showCategories)}
                        >
                            <Menu className="w-4 h-4 text-[#74D644]" />
                            <span>Browse Departments</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
                        </button>
                        {[
                            { name: 'Electronics', slug: 'electronics' },
                            { name: 'Fashion', slug: 'fashion' },
                            { name: 'Home & Garden', slug: 'home-garden' },
                            { name: 'Beauty & Health', slug: 'beauty-health' },
                            { name: 'Sports & Outdoors', slug: 'sports' },
                            { name: 'Toys & Hobbies', slug: 'toys' },
                            { name: 'Weekly Deals', slug: 'deals' }
                        ].map((item) => (
                            <Link key={item.slug} href={`/category/${item.slug}`} className="hover:text-[#74D644] transition-colors">
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* All Categories Dropdown */}
                    {showCategories && (
                        <div data-dropdown-component="true" className="absolute top-full left-16 w-72 bg-white text-gray-800 shadow-2xl rounded-b-2xl border border-gray-100 z-[100] py-3 max-h-[400px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                            {[
                                { name: 'Smartphones & Accessories', slug: 'smartphones' },
                                { name: 'Laptops & Tablets', slug: 'laptops' },
                                { name: 'Women\'s Fashion', slug: 'womens-fashion' },
                                { name: 'Men\'s Fashion', slug: 'mens-fashion' },
                                { name: 'Home Décor & Furniture', slug: 'home-decor' },
                                { name: 'Kitchen & Dining', slug: 'kitchen' },
                                { name: 'Beauty & Skincare', slug: 'beauty' },
                                { name: 'Fitness & Outdoors', slug: 'fitness' },
                                { name: 'Watches & Jewelry', slug: 'watches-jewelry' },
                                { name: 'Kids & Baby', slug: 'kids-baby' },
                                { name: 'Pet Supplies', slug: 'pet-supplies' },
                                { name: 'Automotive & Tools', slug: 'automotive' }
                            ].map((cat) => (
                                <Link 
                                    key={cat.slug} 
                                    href={`/category/${cat.slug}`}
                                    className="block px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#0E5B3D]/10 hover:text-[#0E5B3D] transition-colors flex items-center justify-between group"
                                    onClick={() => setShowCategories(false)}
                                >
                                    <span>{cat.name}</span>
                                    <ChevronDown className="w-4 h-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity text-[#0E5B3D]" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
