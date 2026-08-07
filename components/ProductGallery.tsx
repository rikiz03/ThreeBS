'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store';

interface ProductGalleryProps {
    product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
    const { currentProductImage } = useCartStore();
    const [activeImage, setActiveImage] = useState<string>(product.image);
    const [mounted, setMounted] = useState(false);

    // Build deduplicated thumbnail list: product gallery images first, then variant images
    const thumbnails: string[] = [];
    if (product.image && !thumbnails.includes(product.image)) thumbnails.push(product.image);
    (product.images || []).forEach(img => {
        if (img && !thumbnails.includes(img)) thumbnails.push(img);
    });
    (product.variants || []).forEach(v => {
        if (v.image && !thumbnails.includes(v.image)) thumbnails.push(v.image);
    });

    // When a variant is selected in the BuyBox, the cart store's currentProductImage
    // updates to that variant's image — sync the gallery's main image to match.
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && currentProductImage && thumbnails.includes(currentProductImage)) {
            setActiveImage(currentProductImage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProductImage, mounted]);

    const handleThumbnailClick = (img: string) => {
        setActiveImage(img);
    };

return (
        <div className="flex gap-3 lg:sticky lg:top-24 self-start">
            {/* Vertical Thumbnail Strip (AliExpress style) */}
            {thumbnails.length > 1 && (
                <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide py-1 pr-0.5 max-h-[580px] w-[72px] md:w-[84px] flex-shrink-0">
                    {thumbnails.map((img, index) => (
                        <button
                            key={`${img}-${index}`}
                            onClick={() => handleThumbnailClick(img)}
                            className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 bg-white dark:bg-gray-900 flex-shrink-0 transition-all ${
                                img === activeImage
                                    ? 'border-[#0E5B3D] ring-2 ring-[#0E5B3D]/20 shadow-md'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                            aria-label={`View image ${index + 1}`}
                        >
                            <Image
                                src={img}
                                alt={`${product.title} - image ${index + 1}`}
                                fill
                                unoptimized
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Main Image */}
            <div className="relative aspect-square flex-1 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0a0a0a] group">
                <Image
                    src={activeImage}
                    alt={product.title}
                    fill
                    unoptimized
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.08]"
                    priority
                />
                {/* Price badge overlay (AliExpress style) */}
                {product.originalPrice && (
                    <div className="absolute top-3 left-3 bg-[#0E5B3D] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                )}
            </div>
        </div>
    );
}
