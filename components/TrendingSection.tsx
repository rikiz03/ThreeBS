'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useClicksStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';

/**
 * "Trending Products" section — hidden until a real Top 10 of
 * frequently-clicked products emerges on the platform. Once at least 10
 * products have been clicked, it shows the 10 most frequently clicked.
 */
export default function TrendingSection() {
    const clicks = useClicksStore((state) => state.clicks);

    const clickedProducts = Object.values(clicks)
        .map((entry) => ({ product: entry.product, count: entry.count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // Hide until there are at least 10 distinct products that have been clicked
    // (so a genuine Top 10 can be ranked).
    if (clickedProducts.length < 10) {
        return null;
    }

    return (
        <div className="mb-16" id="products-section">
            <div className="flex items-center justify-between mb-8 px-2">
                <div>
                    <h2 className="text-2xl font-black text-[#0E5B3D] tracking-tight">Trending Products</h2>
                    <p className="text-xs text-gray-500 font-bold mt-0.5">Hot picks &amp; best sellers worldwide</p>
                </div>
                <Link href="/category/deals" className="text-xs font-black text-[#0E5B3D] hover:text-[#74D644] transition-colors flex items-center gap-1 uppercase tracking-wider">
                    See more <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {clickedProducts.map(({ product }) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}