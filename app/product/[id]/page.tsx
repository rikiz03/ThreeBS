import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, ShieldCheck, Truck, RotateCcw, Lock, Share2, Heart } from 'lucide-react';
import { getProduct, getCategories, getRelatedProducts } from '@/lib/data';
import BuyBox from '@/components/BuyBox';
import PriceDisplay from '@/components/PriceDisplay';
import ProductTracker from '@/components/ProductTracker';
import Breadcrumbs from '@/components/Breadcrumbs';
import BuyerReviews from '@/components/BuyerReviews';
import ProductGallery from '@/components/ProductGallery';
import DesktopActionPanel from '@/components/DesktopActionPanel';
import ProductCard from '@/components/ProductCard';
import { getTranslation } from '@/lib/i18n';
import { Metadata, ResolvingMetadata } from 'next';
import { formatDescription } from '@/lib/text-utils';

export const revalidate = 60;

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: product.title,
        description: product.description?.replace(/<[^>]*>/g, '').slice(0, 160) || `Buy ${product.title} at Premium Value Market.`,
        alternates: {
            canonical: `https://premiumvaluemarket.com/product/${id}`,
        },
        openGraph: {
            title: product.title,
            description: product.description?.replace(/<[^>]*>/g, '').slice(0, 160),
            url: `https://premiumvaluemarket.com/product/${id}`,
            siteName: 'Premium Value Market',
            images: [
                {
                    url: product.image,
                    width: 800,
                    height: 800,
                    alt: product.title,
                },
                ...previousImages,
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: product.description?.replace(/<[^>]*>/g, '').slice(0, 160),
            images: [product.image],
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);
    const relatedProducts = await getRelatedProducts(product?.category || '', id);

    if (!product) {
        notFound();
    }

    // Try to find the category slug for the breadcrumb
    const categories = await getCategories();
    const category = categories.find(c => c.name === product.category);
    const breadcrumbItems = [
        ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
        { label: product.title, href: `/product/${product.id}` }
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: product.image,
        description: product.description?.replace(/<[^>]*>/g, ''),
        brand: {
            '@type': 'Brand',
            name: 'Premium Value Market',
        },
        offers: {
            '@type': 'Offer',
            url: `https://premiumvaluemarket.com/product/${id}`,
            priceCurrency: 'USD',
            price: product.price,
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'Premium Value Market',
            },
        },
        aggregateRating: product.reviews > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviews,
        } : undefined,
    };

    const t = (key: string) => getTranslation(key, 'en');

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="container mx-auto px-4 py-6">
            <Breadcrumbs items={breadcrumbItems} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductTracker product={product} />

            {/* AliExpress-style top layout: gallery left, purchase panel right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
                {/* LEFT: Product Gallery */}
                <div className="lg:col-span-5">
                    <ProductGallery product={product} />
                </div>

                {/* RIGHT: Purchase Panel */}
                <div className="lg:col-span-7">
                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-2">
                        {product.title}
                    </h1>

                    {/* Rating + orders row */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className="flex items-center gap-1">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-[#0E5B3D] dark:text-[#74D644] ml-1">{product.rating.toFixed(1)}</span>
                        </div>
                        <span className="w-px h-4 bg-gray-200 dark:bg-gray-700"></span>
                        <span className="text-sm text-gray-500 cursor-pointer hover:underline">{product.reviews} ratings</span>
                        <span className="w-px h-4 bg-gray-200 dark:bg-gray-700"></span>
                        <span className="text-sm text-gray-500">
                            <span className="font-bold text-gray-700 dark:text-gray-300">{Math.max(product.reviews, 1) * 3}</span> sold
                        </span>
                    </div>

                    {/* Price block */}
                    <div className="bg-[#0E5B3D]/5 dark:bg-[#0E5B3D]/10 rounded-2xl p-4 mb-5">
                        <div className="flex flex-wrap items-center gap-3">
                            <PriceDisplay price={product.price} originalPrice={product.originalPrice} showOriginal={true} size="xl" />
                            {discount > 0 && (
                                <div className="bg-[#74D644] text-[#0E5B3D] text-sm font-black px-3 py-1 rounded-lg">
                                    -{discount}% {t('off')}
                                </div>
                            )}
                        </div>
                        <div className="mt-2 text-[#0E5B3D] dark:text-[#74D644] text-sm font-medium flex items-center gap-1.5">
                            <Truck className="w-4 h-4" /> Final Price - Includes Free Tracked Shipping
                        </div>
                    </div>

                    {/* BuyBox (attributes, quantity, shipping, buttons) */}
                    <BuyBox product={product} />

                    {/* Trust badges row */}
                    <div className="grid grid-cols-3 gap-3 mt-5">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/40 rounded-xl p-3">
                            <Truck className="w-5 h-5 text-[#0E5B3D]" />
                            <div>
                                <span className="block text-xs font-bold text-gray-800 dark:text-gray-200">Worldwide Tracking</span>
                                <span className="block text-[10px] text-gray-500">Free tracked shipping</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/40 rounded-xl p-3">
                            <RotateCcw className="w-5 h-5 text-[#0E5B3D]" />
                            <div>
                                <span className="block text-xs font-bold text-gray-800 dark:text-gray-200">Hassle-Free Returns</span>
                                <span className="block text-[10px] text-gray-500">30-day return policy</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/40 rounded-xl p-3">
                            <ShieldCheck className="w-5 h-5 text-[#0E5B3D]" />
                            <div>
                                <span className="block text-xs font-bold text-gray-800 dark:text-gray-200">Secure Payment</span>
                                <span className="block text-[10px] text-gray-500">100% encrypted checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Description Section */}
            <div className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Product Details</h2>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatDescription(product.description || "") }} />
            </div>

            {/* Buyer Reviews Section */}
            <div className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-10">
                <BuyerReviews 
                    reviews={product.buyerReviews || []} 
                    averageRating={product.rating} 
                    totalReviews={product.reviews} 
                />
            </div>

            {/* Similar Items Section (AliExpress recommendation rail) */}
            <div className="mt-14 border-t border-gray-100 dark:border-gray-800 pt-10">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Similar Items</h2>
                        <p className="text-gray-500 text-sm mt-1">You may also like these related products</p>
                    </div>
                    <div className="hidden md:block bg-[#74D644]/20 text-[#0E5B3D] dark:text-[#74D644] text-[10px] font-bold uppercase px-3 py-1.5 rounded-full">
                        Recommended for you
                    </div>
                </div>
                {relatedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-8 text-center text-gray-400 text-sm">
                        More items from this collection are on their way. Check back soon!
                    </div>
                )}
            </div>
        </div>
    );
}
