'use client';

import { Review } from '@/lib/types';
import { useReviewsStore } from '@/lib/store';
import { Star, CheckCircle2, User, Send } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface BuyerReviewsProps {
    productId: string;
    reviews: Review[];
}

export default function BuyerReviews({ productId, reviews }: BuyerReviewsProps) {
    // Buyers' locally-submitted reviews for this product (persisted in browser)
    const localReviews = useReviewsStore((state) => state.reviews[productId]) || [];
    const addReview = useReviewsStore((state) => state.addReview);

    const allReviews = [...reviews, ...localReviews];

    // Form state for the "Write a review" widget
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [author, setAuthor] = useState('');
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Show absolutely nothing if the product has no reviews yet.
    if (allReviews.length === 0) {
        return null;
    }

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    const totalReviews = allReviews.length;

    const distribution = [5, 4, 3, 2, 1].map(star => {
        const count = allReviews.filter(r => Math.round(r.rating) === star).length;
        const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
        return { star, count, pct };
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating < 1 || !comment.trim()) return;

        setIsSubmitting(true);
        setSubmitError(null);

        const name = author.trim() || 'Verified Buyer';
        const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const newReview: Review = {
            id: `local-${Date.now()}`,
            author: name,
            rating,
            date,
            comment: comment.trim(),
            verified: true,
        };

        // Persist to the shared store via the server endpoint so all visitors
        // eventually see the same reviews (also ingested by Areviews).
        try {
            const res = await fetch('/api/product-reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    rating,
                    author: name,
                    comment: newReview.comment,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.error || 'Failed to save review');
            }
        } catch (err) {
            console.error('Review save failed:', err);
            // Offline / not-configured fallback: keep the review on this device.
            addReview(productId, newReview);
            setSubmitError('Could not reach the server — your review was saved on this device only.');
        }

        // Show the review immediately for a smooth UX.
        addReview(productId, newReview);

        setRating(0);
        setHoverRating(0);
        setAuthor('');
        setComment('');
        setSubmitted(true);
        setIsSubmitting(false);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <section className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-10">
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
                                    className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-current' : 'text-gray-300 dark:text-gray-700'}`}
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
                        {allReviews.slice(0, 3).map((rev, i) => (
                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {allReviews.map((review) => (
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
            
            {/* Write a review form */}
            <div className="mt-8 bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Write a Review</h3>

                {submitted && (
                    <div className="mb-4 p-3 rounded-lg bg-[#74D644]/15 text-[#0E5B3D] dark:text-[#74D644] text-sm font-bold">
                        Thank you! Your review has been added.
                    </div>
                )}

                {submitError && (
                    <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm font-medium">
                        {submitError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Star rating selector */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Your Rating</label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`w-7 h-7 ${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Name</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Your name (optional)"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#74D644]/40"
                        />
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Your Review</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this product..."
                            rows={4}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#74D644]/40 resize-y"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || rating < 1 || !comment.trim()}
                        className="inline-flex items-center gap-2 bg-[#0E5B3D] hover:bg-[#0a4a33] text-white font-black px-6 py-3 rounded-full text-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </section>
    );
}
