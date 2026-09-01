'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Star, Heart, CheckCircle2, Plus, Minus } from 'lucide-react';
import { useCartStore, useSettingsStore } from '@/lib/store';
import { getCurrencyInfo } from '@/lib/geo';
import { useState } from 'react';
import { useTranslatedText } from '@/lib/translate';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { currency, locale } = useSettingsStore();
    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useCartStore((state) => state.removeItem);
    const cartItems = useCartStore((state) => state.items);
    const translatedTitle = useTranslatedText(product.title, locale);
    
    // Check how many of this item are in cart (sum quantities, not entry count)
    const cartItemCount = cartItems
        .filter(item => item.id === product.id)
        .reduce((sum, item) => sum + item.quantity, 0);
    const [isHovered, setIsHovered] = useState(false);

    // Currency symbol & rate for accurate, localized pricing
    const { symbol, rate } = getCurrencyInfo(currency);

    // Format price with superscript cents as shown in mockup (e.g. $17.29)
    const formatPriceParts = (price: number) => {
        const parts = (price * rate).toFixed(2).split('.');
        return {
            dollars: parts[0],
            cents: parts[1]
        };
    };

    const priceParts = formatPriceParts(product.price);
    
    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartItemCount > 0) {
            removeItem(product.id);
        }
    };

    return (
        <div 
            className="bg-white rounded-3xl p-4 transition-all duration-300 hover:shadow-xl border border-gray-100 flex flex-col h-full relative group overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Wishlist Button */}
            <button aria-label="Add to wishlist" className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-50 hover:bg-[#74D644]/20 text-gray-400 hover:text-[#0E5B3D] transition-colors shadow-sm focus:outline-none">
                <Heart className="w-4 h-4" />
            </button>

            {/* Product Image */}
            <Link href={`/product/${product.id}`} className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-[#F8FAFC] flex justify-center items-center group-hover:bg-[#74D644]/5 transition-colors p-4">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 150px, 200px"
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                />
            </Link>

            {/* Product Details */}
            <div className="flex flex-col flex-1 px-1">
                {/* Title & Subtitle */}
                <Link href={`/product/${product.id}`} className="block mb-1">
                    <h3 className="text-sm font-black text-gray-900 line-clamp-1 group-hover:text-[#0E5B3D] transition-colors leading-snug">
                        {translatedTitle}
                    </h3>
                </Link>

                {/* Bottom Row: Price & Quantity Selector Pill */}
                <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-gray-50">
                    {/* Currency sign in front, e.g. $17.29 */}
                    <div className="flex items-start text-gray-900 font-black">
                        <span className="text-xs leading-none pt-0.5 mr-0.5">{symbol}</span>
                        <span className="text-xl leading-none">{priceParts.dollars}</span>
                        <span className="text-xs leading-none pt-0.5">.{priceParts.cents}</span>
                    </div>

                    {/* Dynamic Add to Cart / Quantity Selector Pill (From Mockup) */}
                    <div>
                        {cartItemCount > 0 ? (
                            <div className="flex items-center gap-3 bg-[#74D644] text-[#0E5B3D] px-3 py-1.5 rounded-full shadow-md font-black text-xs animate-in fade-in zoom-in duration-200">
                                <button 
                                    onClick={handleRemove}
                                    className="w-5 h-5 rounded-full bg-white/50 hover:bg-white flex items-center justify-center transition-colors focus:outline-none"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-4 text-center">{cartItemCount}</span>
                                <button 
                                    onClick={handleAdd}
                                    className="w-5 h-5 rounded-full bg-white/50 hover:bg-white flex items-center justify-center transition-colors focus:outline-none"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={handleAdd}
                                className="w-9 h-9 rounded-full bg-[#F8FAFC] hover:bg-[#74D644] text-gray-600 hover:text-[#0E5B3D] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none group-hover:bg-[#74D644] group-hover:text-[#0E5B3D]"
                                aria-label="Add to cart"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
