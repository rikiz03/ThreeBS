'use client';

import { Review } from '@/lib/types';
import { Star, CheckCircle2, User } from 'lucide-react';
import Image from 'next/image';

interface BuyerReviewsProps {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}

export default function BuyerReviews({ reviews, averageRating, totalReviews }: BuyerReviewsProps) {
    // Compute rating distribution (5★ to 1★) for the breakdown bars
    const distribution = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => Math.round(r.rating) === star).length;
        const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
        return { star, count, pct };
    });

    return (
        <section className="mt-4">
            {/* AliExpress-style rating summary */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Customer Reviews</h2>
                <div className="flex flex-wrap items-start gap-6 bg-gray-50 dark:bg-gray-900/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                    {/* Big average rating number */}
                    <div className="flex flex-col items-center min-w-[90px]">
                        <span className="text-4xl font-black text-[#0E5B3D] dark:text-[#74D644]">{averageRating.toFixed(1)}</span>
                        <div className="flex text-yellow-400 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'fill-current' : 'text-gray-300 dark:text-gray-700'}`} 
                                />
                            ))}
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium mt-1">{totalReviews} reviews</span>
                    </div>
                    <div className="h-[80px] w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                    {/* Rating breakdown bars */}
                    <div className="flex-1 min-w-[200px] space-y-1.5">
                        {distribution.map(({ star, pct }) => (
                            <div key={star} className="flex items-center gap-2 text-xs">
                                <span className="w-6 text-gray-600 dark:text-gray-300 font-bold flex items-center gap-0.5">
                                    {star}<Star className="w-3 h-3 text-yellow-400 fill-current" />
                                </span>
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#74D644] rounded-full transition-all duration-500"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className="w-8 text-right text-gray-400 text-[10px] font-bold">{pct}%</span>
                            </div>
                        ))}
                    </div>

                    <div className="ml-auto hidden md:flex -space-x-2">
                        {reviews.slice(0, 3).map((rev) => (
                            <div key={rev.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-[#121212] rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#0E5B3D]/10 dark:bg-[#0E5B3D]/30 flex items-center justify-center">
                                    <User className="w-5 h-5 text-[#0E5B3D] dark:text-[#74D644]" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                        {review.author}
                                        {review.verified && (
                                            <CheckCircle2 className="w-3 h-3 text-[#74D644]" />
                                        )}
                                    </div>
                                    <div className="text-[10px] text-gray-400">{review.date}</div>
                                </div>
                            </div>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} 
                                    />
                                ))}
                            </div>
                        </div>

<p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-4 italic">
                            {`"${review.comment}"`}
                        </p>

                        {review.images && review.images.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {review.images.map((img, idx) => (
                                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                                        <Image 
                                            src={img} 
                                            alt="Review photo"
                                            fill
                                            className="object-cover"
                                            unoptimized // For picsum photos during dev
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mt-8 text-center">
                <button className="text-xs text-[#0E5B3D] dark:text-[#74D644] font-bold hover:underline">
                    Read all {totalReviews} reviews
                </button>
            </div>
        </section>
    );
}
