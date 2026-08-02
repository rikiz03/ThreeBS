import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';
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
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs items={breadcrumbItems} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductTracker product={product} />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* 1. TOP ON MOBILE: Image Gallery (AliExpress style) */}
                <div className="md:col-span-5 md:order-1 order-1 flex flex-col gap-4">
                    <ProductGallery product={product} />
                    <DesktopActionPanel product={product} />
                </div>

                {/* 2. SECOND ON MOBILE: Buy Box card */}
                <div className="md:col-span-3 md:order-3 order-2 md:sticky md:top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide pb-4">
                    <BuyBox product={product} />
                </div>

                {/* 3. THIRD ON MOBILE: Product Heading & Details */}
                <div className="md:col-span-4 md:order-2 order-3">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.title}</h1>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
                            ))}
                        </div>
                        <span className="text-blue-600 cursor-pointer hover:underline">{product.reviews} ratings</span>
                    </div>

                    <div className="border-t border-b border-gray-100 dark:border-gray-800 py-4 mb-4">
                        <PriceDisplay 
                            price={product.price} 
                            originalPrice={product.originalPrice} 
                            showOriginal={true} 
                            size="xl" 
                        />
                        <div className="mt-2 text-teal-600 text-sm font-medium flex items-center gap-1">
                            <Truck className="w-4 h-4" /> Final Price - Includes Free Tracked Shipping
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-red-600 text-sm font-medium">-{discount}% {t('off')}</span>
                        </div>
                    </div>

                    {/* Trust Badge: Global Shipping */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-lg p-3 inline-flex items-center gap-2 mb-6 w-full">
                        <Truck className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                        <div>
                            <span className="block text-sm font-bold text-blue-800 dark:text-blue-300">Worldwide Tracked Shipping</span>
                            <span className="block text-xs text-blue-600 dark:text-blue-400/70">See estimated delivery time in the Buy Box</span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-2">
                            <div className="mt-1"><RotateCcw className="w-5 h-5 text-gray-400" /></div>
                            <div>
                                <span className="font-semibold block text-sm">Hassle-Free Returns</span>
                                <p className="text-xs text-gray-500">Shop with confidence with our 30-day return policy.</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm">
                        <p className="font-bold mb-2">About this item</p>
                        <div className="text-gray-700 dark:text-gray-300 space-y-2 dangerously-set-inner-html" dangerouslySetInnerHTML={{ __html: formatDescription(product.description || "") }} />
                    </div>
                </div>

                {/* Buyer Reviews Bunch */}
                <div className="md:col-span-5 md:order-1 order-4 -mt-4">
                    <BuyerReviews 
                        reviews={product.buyerReviews || []} 
                        averageRating={product.rating} 
                        totalReviews={product.reviews} 
                    />
                </div>
            </div>

            {/* NEW: Frequently Bought Together (Upsell Section) */}
            {relatedProducts.length > 0 && (
                <div className="mt-16 border-t border-gray-100 dark:border-gray-800 pt-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Bought Together</h2>
                            <p className="text-gray-500 text-sm">Customers who viewed this also bought these related items.</p>
                        </div>
                        <div className="hidden md:flex gap-2">
                            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase px-2 py-1 rounded">Bundle & Save 10%</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
