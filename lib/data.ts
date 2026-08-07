import { Product, Category, Review } from "./types";
import { WooProduct, WooCategory } from "./woocommerce";
import { identifySupplier } from "./fulfillment";

const WOO_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// In-memory TTL cache to deduplicate repeat/simultaneous fetches (e.g. generateMetadata + page).
// Prevents the product page from re-fetching the same data 2x, which previously could cause 40s+ loads.
const fetchCache = new Map<string, { data: any; timestamp: number }>();
const FETCH_CACHE_TTL = 30 * 1000; // 30 seconds

async function wooFetch(endpoint: string, params: Record<string, string | number> = {}) {
    if (!WOO_URL || !CK || !CS) {
        throw new Error("WooCommerce credentials missing");
    }

    const url = new URL(`${WOO_URL}/wp-json/wc/v3/${endpoint}`);
    url.searchParams.set("consumer_key", CK);
    url.searchParams.set("consumer_secret", CS);

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value.toString());
    });

    const cacheKey = url.toString();
    const cached = fetchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < FETCH_CACHE_TTL) {
        return cached.data;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); 

    try {
        const res = await fetch(url.toString(), {
            next: { revalidate: 60 },
            signal: controller.signal
        });

        if (!res.ok) {
            throw new Error(`WooCommerce API error: ${res.statusText}`);
        }

        const data = await res.json();
        fetchCache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
    } finally {
        clearTimeout(timeoutId);
    }
}

export const CATEGORY_IMAGES: Record<string, string> = {
    'electronics & gadgets': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400&h=400&fit=crop',
    'mobile accessories': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&h=400&fit=crop',
    'fitness & gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&h=400&fit=crop',
    'sports gear': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=400&h=400&fit=crop',
    'outdoor & camping': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=400&h=400&fit=crop',
    'outdoor': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=400&h=400&fit=crop',
    'outdoors': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=400&h=400&fit=crop',
    'outdoor camping': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=400&h=400&fit=crop',
    'garden & outdoor': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=400&h=400&fit=crop',
    'fashion & apparel': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&h=400&fit=crop',
    'clothing': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&h=400&fit=crop',
    'home & living': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&h=400&fit=crop',
    'personal care & beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&h=400&fit=crop',
    'health & medical': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&h=400&fit=crop',
    'automotive': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=400&h=400&fit=crop',
    'musical instruments': 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400&h=400&fit=crop'
};

// Direct Unsplash photo URLs by keyword — replaces the deprecated source.unsplash.com service.
// Fallback for category names not in CATEGORY_IMAGES so categories never show a broken image.
const CATEGORY_FALLBACK_KEYWORDS: Record<string, string> = {
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400&h=400&fit=crop',
    'mobile': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&h=400&fit=crop',
    'phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&h=400&fit=crop',
    'fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&h=400&fit=crop',
    'gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&h=400&fit=crop',
    'workout': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&h=400&fit=crop',
    'sport': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=400&h=400&fit=crop',
    'outdoor': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=400&h=400&fit=crop',
    'camping': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=400&h=400&fit=crop',
    'garden': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=400&h=400&fit=crop',
    'fashion': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&h=400&fit=crop',
    'clothing': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&h=400&fit=crop',
    'home': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&h=400&fit=crop',
    'beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&h=400&fit=crop',
    'health': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&h=400&fit=crop',
    'medical': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&h=400&fit=crop',
    'auto': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=400&h=400&fit=crop',
    'car': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=400&h=400&fit=crop',
    'music': 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400&h=400&fit=crop',
'book': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&h=400&fit=crop',
    'toy': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=400&h=400&fit=crop',
    'gadget': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400&h=400&fit=crop',
    'digital': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&h=400&fit=crop',
    'computer': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400&h=400&fit=crop',
    'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400&h=400&fit=crop',
    'accessor': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=400&h=400&fit=crop',
    'jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&h=400&fit=crop',
    'watch': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=400&h=400&fit=crop',
'shoe': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&h=400&fit=crop',
    'sneaker': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&h=400&fit=crop',
    'bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&h=400&fit=crop',
    'handbag': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&h=400&fit=crop',
    'kitchen': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=400&h=400&fit=crop',
    'cook': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&h=400&fit=crop',
    'food': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&h=400&fit=crop',
    'furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&h=400&fit=crop',
    'decor': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&h=400&fit=crop',
    'light': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=400&h=400&fit=crop',
    'pet': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&h=400&fit=crop',
    'animal': 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=400&h=400&fit=crop',
'baby': 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=400&h=400&fit=crop',
    'office': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=400&h=400&fit=crop',
    'stationery': 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=400&h=400&fit=crop',
'tool': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400&h=400&fit=crop',
    'plant': 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=400&h=400&fit=crop',
'travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400&h=400&fit=crop',
    'luggage': 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=400&h=400&fit=crop',
    'security': 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=400&h=400&fit=crop',
    'camera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&h=400&fit=crop',
    'photography': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&h=400&fit=crop',
};

function getCategoryFallbackImage(name: string): string {
    const lower = name.toLowerCase();
    for (const [keyword, url] of Object.entries(CATEGORY_FALLBACK_KEYWORDS)) {
        if (lower.includes(keyword)) return url;
    }
    // Ultimate fallback: a generic retail/shopping Unsplash image (never a broken image or green block)
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&h=400&fit=crop';
}

export const FEATURED_CATEGORIES: Category[] = [
    { id: 'cat-gym', name: 'Elite Fitness', slug: 'fitness-gym', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&h=400&fit=crop' },
    { id: 'cat-mobile', name: 'Mobile Essentials', slug: 'mobile-accessories', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&h=400&fit=crop' },
    { id: 'cat-auto', name: 'Automotive', slug: 'automotive', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=400&h=400&fit=crop' },
    { id: 'cat-creator', name: 'Creator Studio', slug: 'creator-studio', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&h=400&fit=crop' },
    { id: 'cat-outdoor', name: 'Outdoor Gear', slug: 'outdoor-adventure', image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=400&h=400&fit=crop' },
    { id: 'cat-home', name: 'Home & Lifestyle', slug: 'home-lifestyle', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&h=400&fit=crop' },
    { id: 'cat-wellness', name: 'Wellness', slug: 'health-wellness', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&h=400&fit=crop' },
];


export const CATEGORY_TITLE_MAP: Record<string, string> = {
    'fitness-gym': 'Elite Fitness & Home Gym',
    'mobile-accessories': 'Modern Mobile Essentials',
    'automotive': 'Automotive Style & Care',
    'creator-studio': 'Professional Creator Studio',
    'outdoor-adventure': 'Outdoor & Adventure Gear',
    'home-lifestyle': 'Premium Home & Lifestyle',
    'health-wellness': 'Health, Beauty & Personal Wellness'
};


export const SEMANTIC_CRITERIA: Record<string, string[]> = {
    'cat-gym': ['fitness', 'gym', 'workout', 'bench', 'power cage', 'yoga', 'hip stretch', 'belt', 'tracksuit', 'shorts', 'leggings', 'sports', 'athletic', 'rehabilitation', 'exercise bike'],
    'cat-mobile': ['phone', 'mobile', 'charger', 'usb', 'lanyard', 'strap', 'case', 'keyboard', 'tablet', 'wireless charger', 'power bank', 'data cable', 'headset', 'bluetooth', 'earbud', 'adapter', 'charging'],
    'cat-auto': ['car', 'automotive', 'suv', 'mattress', 'repair kit', 'ornament', 'seat cushion', 'night light', 'signal booster', 'antenna', 'amplifier', 'valve', 'tire', 'pump'],
    'cat-creator': ['selfie', 'ring light', 'vlog', 'monitor', 'camera', 'tripod', 'microphone', 'photography', 'lighting', 'studio', 'video'],
    'cat-outdoor': ['outdoor', 'adventure', 'camping', 'backpack', 'bbq', 'grill', 'stove', 'flashlight', 'fishing', 'cycling', 'tactical', 'survival', 'hiking', 'cooler', 'lantern'],
    'cat-home': ['home', 'living', 'lifestyle', 'ashtray', 'walnut', 'air fryer', 'atmosphere', 'lamp', 'speaker', 'clock', 'shelf', 'organizer', 'humidifier', 'kitchen', 'decor', 'furniture', 'rug'],
    'cat-wellness': ['health', 'beauty', 'care', 'massage', 'wellness', 'skincare', 'face mask', 'neck cover', 'medical', 'therapy', 'spa', 'cosmetic'],
};



export const EXCLUSION_CRITERIA: Record<string, string[]> = {
    'cat-1': ['cosmetic', 'makeup', 'bag', 'beauty', 'purse', 'toiletries', 'clothing', 'apparel', 'shirt', 'dress', 'shoe'],
    'cat-2': ['electronic', 'battery', 'charger', 'usb', 'smart', 'tech', 'device', 'app', 'hardware', 'software', 'car', 'jump', 'starter', 'tool', 'gadget', 'camera', 'security', 'surveillance', 'monitoring', 'bulb', 'cam', 'cctv', 'lens', 'video', 'vision', 'lightbulb'],
    'cat-5': ['battery', 'charger', 'usb', 'cable', 'screen', 'display', 'mechanical', 'car', 'tire', 'hardware', 'software', 'phone', 'computer', 'laptop', 'jump', 'starter', 'camera', 'security', 'surveillance', 'monitoring', 'wifi', 'router', 'recognition', 'bulb', 'cam', 'cctv', 'lens', 'video', 'vision', 'lightbulb'],
    'cat-16': ['electronic', 'battery', 'charger', 'usb', 'smart', 'tech', 'device', 'app', 'hardware', 'software', 'car', 'jump', 'starter', 'tool', 'gadget', 'camera', 'security', 'surveillance', 'monitoring', 'bulb', 'cam', 'cctv', 'lens', 'video', 'vision', 'lightbulb'],
};

export function isSemanticMatch(product: any, categoryId: string): boolean {

    const criteria = SEMANTIC_CRITERIA[categoryId];


    if (!criteria) return true;

    const category = FEATURED_CATEGORIES.find(c => c.id === categoryId);
    
    if (category && product.category) {
        const prodCat = product.category.toLowerCase();
        const targetCat = category.name.toLowerCase();
        if (prodCat.includes(targetCat) || targetCat.includes(prodCat)) return true;
        if (targetCat === 'fashion' && (prodCat.includes('clothing') || prodCat.includes('apparel'))) return true;
        if (targetCat === 'clothing' && (prodCat.includes('fashion') || prodCat.includes('apparel'))) return true;
    }

    const content = `${product.title} ${product.description} ${product.short_description}`.toLowerCase();
    
    const exclusions = EXCLUSION_CRITERIA[categoryId];
    if (exclusions) {
        const hasBannedWord = exclusions.some(word => {
            const regex = new RegExp('\\b' + word.toLowerCase() + '\\b', 'i');
            return regex.test(content);
        });
        if (hasBannedWord) return false;
    }

    return criteria.some(keyword => {
        const regex = new RegExp('\\b' + keyword.toLowerCase() + '\\b', 'i');
        return regex.test(content);
    });
}

/**
 * Normalizes price and applies the $10 Golden Shipping Buffer.
 */
function applyPriceLogic(rawPrice: string | number | undefined): number {
    const price = parseFloat(String(rawPrice || "0"));
    return price + 10;
}

export async function getProducts(params: Record<string, string | number> = {}): Promise<Product[]> {
    try {
        const queryParams: Record<string, string | number> = { 
            stock_status: "instock", 
            per_page: 50, 
            _fields: "id,name,price,regular_price,images,average_rating,rating_count,categories,short_description,meta_data",
            ...params 
        };
        
        // Identify if this is a "Semantic Category" (Home Page Sections)
        const isFeatured = typeof params.category === 'string' && params.category.startsWith('cat-');
        let categoryId = isFeatured ? (params.category as string) : null;
        
        // Handle regular category IDs (from Category Page) - check if they match our semantic filters
        if (!isFeatured && params.category) {
            const feat = FEATURED_CATEGORIES.find(fc => fc.id === params.category.toString());
            if (feat) categoryId = feat.id;
        }

        let data: any[] = [];

        if (isFeatured) {
            delete queryParams.category;
            
            // Parallel fetch for up to 400 items to support semantic filtering
            // Splitting into smaller pages of 50 to avoid Vercel's 2MB data cache limit per fetch
            const pagePromises = [1, 2, 3, 4, 5, 6, 7, 8].map(p => 
                wooFetch("products", { ...queryParams, per_page: 50, page: p })
                    .catch(() => []) // Handle individual page timeouts gracefully
            );
            
            const pagesData = await Promise.all(pagePromises);
            for (const pageData of pagesData) {
                if (Array.isArray(pageData)) {
                    data.push(...pageData);
                }
            }
        } else {
            data = await wooFetch("products", queryParams);
        }

        
        if (!Array.isArray(data)) return [];

        let products = data.map((p: WooProduct & { meta_data: unknown[] }) => {

            const { supplier, externalId } = identifySupplier(p.meta_data || []);
            const basePrice = applyPriceLogic(p.price);
            const regularPrice = applyPriceLogic(p.regular_price);
            // Only show a strikethrough price when WooCommerce provides a legitimate higher regular_price.
            // No artificial inflation (removed the basePrice * 1.67 fake discount).
            const originalPrice = regularPrice && regularPrice > basePrice ? regularPrice : undefined;

            return {
                id: p.id.toString(),
                title: p.name,
                price: basePrice,
                originalPrice,
                image: p.images[0]?.src || "https://placehold.co/600x600/png?text=No+Image",
                rating: parseFloat(p.average_rating || "0"),
                reviews: p.rating_count,
                category: p.categories[0]?.name || "Uncategorized",
                allCategories: p.categories?.map((cat: any) => cat.name) || [],
                description: p.short_description || p.description,
                supplier,
                externalId
            };
        });

        // Only apply semantic filtering for our curated Home-page “cat-*” categories.
        // WooCommerce category pages should show imported products without being filtered out.
        const isSemanticFeaturedCategory = typeof params.category === 'string' && params.category.startsWith('cat-');
        if (categoryId && isSemanticFeaturedCategory) {
            products = products.filter(p => isSemanticMatch(p, categoryId));
        }


        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}


export async function getProduct(id: string): Promise<Product | null> {
    try {
        const p: WooProduct & { meta_data: any[] } = await wooFetch(`products/${id}`);
        if (!p || !p.id) return null;

        const { supplier, externalId } = identifySupplier(p.meta_data || []);
        
// If it's a variable product, we use the price if set, otherwise we'll wait for variants
        const basePrice = applyPriceLogic(p.price);
        const regularPrice = applyPriceLogic(p.regular_price);
        const originalPrice = regularPrice && regularPrice > basePrice ? regularPrice : undefined;

        let variants: Product['variants'] = [];
        let attributes = p.attributes?.map(attr => ({
            name: attr.name,
            options: attr.options
        })) || [];

        if (p.type === 'variable' && p.variations?.length > 0) {
            try {
                const variationsData = await wooFetch(`products/${id}/variations`, { per_page: 100 });
                if (Array.isArray(variationsData)) {
                    variants = variationsData.map((v: any) => ({
                        id: v.id.toString(),
                        price: applyPriceLogic(v.price),
                        image: v.image?.src,
                        attributes: v.attributes.map((attr: any) => ({
                            name: attr.name,
                            option: attr.option
                        }))
                    }));

                    // If product-level attributes are missing (common for CJ/DSers/EPROLO imports),
                    // derive them from the variations themselves so the variant selector still shows.
                    if (attributes.length === 0 && variants.length > 0) {
                        const derivedMap: Record<string, Set<string>> = {};
                        variants.forEach(v => {
                            v.attributes?.forEach(attr => {
                                if (!derivedMap[attr.name]) derivedMap[attr.name] = new Set();
                                derivedMap[attr.name].add(attr.option);
                            });
                        });
                        attributes = Object.entries(derivedMap).map(([name, optionsSet]) => ({
                            name,
                            options: Array.from(optionsSet)
                        }));
                    }
                }
            } catch (vError) {
                console.error(`Error fetching variations for product ${id}:`, vError);
            }
        }

        // Build gallery images: product gallery images + variant images (deduplicated)
        const galleryImages: string[] = [];
        (p.images || []).forEach((img: any) => {
            if (img?.src && !galleryImages.includes(img.src)) galleryImages.push(img.src);
        });
        variants.forEach(v => {
            if (v.image && !galleryImages.includes(v.image)) galleryImages.push(v.image);
        });
        const images = galleryImages.length > 0 ? galleryImages : [p.images[0]?.src || "https://placehold.co/600x600/png?text=No+Image"];

        let realReviews: Review[] = [];


        try {
            const reviewsData = await wooFetch(`products/reviews`, { product: id });
            if (Array.isArray(reviewsData)) {
                realReviews = reviewsData.map((r: any) => ({
                    id: r.id.toString(),
                    author: r.reviewer,
                    rating: r.rating,
                    date: new Date(r.date_created).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    comment: r.review.replace(/<[^>]*>?/gm, ''), // strip html
                    verified: r.verified,
                    images: []
                }));
            }
        } catch (rError) {
            console.error(`Error fetching reviews for product ${id}:`, rError);
        }

        return {
            id: p.id.toString(),
            title: p.name,
            price: basePrice,
            originalPrice,
            image: p.images[0]?.src || "https://placehold.co/600x600/png?text=No+Image",
            images,
            rating: parseFloat(p.average_rating || "0"),
            reviews: p.rating_count,
            category: p.categories[0]?.name || "Uncategorized",
            allCategories: p.categories?.map((cat: any) => cat.name) || [],
            description: p.description,
            supplier,
            externalId,
            attributes,
            variants,
            buyerReviews: realReviews
        };
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
}

export async function getRelatedProducts(categoryName: string, currentProductId: string): Promise<Product[]> {
    try {
        // Fetch a broad pool of products so we have enough to match against.
        const pool = await getProducts({ per_page: 50, page: 1 });

        // Prefer products that share the current product's category (semantic match).
        const cat = (categoryName || '').toLowerCase();
        let related = pool.filter(p => p.id !== currentProductId && (p.allCategories || []).some(c => c.toLowerCase() === cat || (cat && c.toLowerCase().includes(cat))));

        // If we don't have enough same-category matches, fill from other popular products.
        if (related.length < 4) {
            const others = pool.filter(p => p.id !== currentProductId && !related.includes(p));
            related = related.concat(others);
        }

        // Cap to 8, always return at least the top pool items (never empty).
        return related.slice(0, 8);
    } catch (error) {
        return [];
    }
}

export async function getCategories(params: Record<string, string | number> = {}): Promise<Category[]> {
    try {
        const data = await wooFetch("products/categories", { hide_empty: 1, parent: 0, ...params });
        if (!Array.isArray(data)) return FEATURED_CATEGORIES;

        const categories = data
            .map((c: WooCategory) => ({
                id: c.id.toString(),
                name: c.name,
                slug: c.slug,
                image: c.image?.src || null 
            }))
            .filter(c => !(c.slug === 'uncategorized' && !c.image))
            .filter(c => !['cat-17', 'cat-18', 'cat-19'].includes(c.id)); // Exclude subsections from categories list

        if (categories.length < 2) {
            return FEATURED_CATEGORIES.filter(c => !['cat-17', 'cat-18', 'cat-19'].includes(c.id));
        }

        const NICE_NAMES: Record<string, string> = {
            'electronics & gadgets': 'Electronics',
            'mobile accessories': 'Mobile Accessories',
            'fitness & gym': 'Fitness',
            'sports gear': 'Sports Gear',
            'outdoor & camping': 'Outdoor',
            'fashion & apparel': 'Fashion',
            'home & living': 'Home Decor',
            'personal care & beauty': 'Health & Beauty',
            'health & medical': 'Health & Medical',
            'automotive': 'Automotive',
            'musical instruments': 'Music'
        };

        return categories.map(c => {
            // Aggressive decoding to handle multiple possible formats
            const decodedName = c.name
                .replace(/&amp;/g, '&')
                .replace(/&#038;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'");
            
            const normalizedName = decodedName.toLowerCase().trim();
            const niceName = NICE_NAMES[normalizedName] || decodedName;
            
            const isPlaceholder = c.image && (c.image.includes('placeholder') || c.image.includes('default'));
            
            // Try normalized name, then slug, then partial matches for 'outdoor'
            let finalImage = (CATEGORY_IMAGES[normalizedName] || CATEGORY_IMAGES[c.slug.replace('-', ' ')]);
            
            if (!finalImage && normalizedName.includes('outdoor')) {
                finalImage = CATEGORY_IMAGES['outdoor'];
            }
            
            if (!finalImage) {
                finalImage = (!c.image || isPlaceholder) ? getCategoryFallbackImage(niceName) : c.image;
            }

            return {
                ...c,
                name: niceName,
                image: finalImage
            };
        });

    } catch (error) {
        return FEATURED_CATEGORIES.filter(c => !['cat-17', 'cat-18', 'cat-19'].includes(c.id));
    }
}


export async function getCategory(slug: string): Promise<Category | null> {
    try {
        const feat = FEATURED_CATEGORIES.find(cat => cat.slug === slug);
        const mappedTitle = CATEGORY_TITLE_MAP[slug];

        // If it's one of our semantic categories, prioritize returning that ID
        if (feat) {
            return {
                ...feat,
                name: mappedTitle || feat.name
            };
        }

        const data = await wooFetch("products/categories", { slug });
        const c: WooCategory = data[0];

        if (!c) return null;

        return {
            id: c.id.toString(),
            name: (mappedTitle || c.name).replace(/&amp;/g, '&').replace(/&#038;/g, '&'), // Priority to marketing title
            slug: c.slug,
            image: c.image?.src || getCategoryFallbackImage(c.name)
        };
    } catch (error) {
        const feat = FEATURED_CATEGORIES.find(cat => cat.slug === slug);
        if (feat) {
            return {
                ...feat,
                name: CATEGORY_TITLE_MAP[slug] || feat.name
            };
        }
        return null;
    }
}

