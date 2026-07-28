import { Product, Category, Review } from "./types";
import { WooProduct, WooCategory } from "./woocommerce";
import { identifySupplier } from "./fulfillment";

const WOO_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET;

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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); 

    try {
        const res = await fetch(url.toString(), {
            next: { revalidate: 60 },
            signal: controller.signal
        });

        if (!res.ok) {
            throw new Error(`WooCommerce API error: ${res.statusText}`);
        }

        return res.json();
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
            let originalPrice = applyPriceLogic(p.regular_price);
            
            if (!originalPrice || originalPrice <= basePrice) {
                originalPrice = basePrice * 1.67;
            }

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
        let originalPrice = applyPriceLogic(p.regular_price);

        if (!originalPrice || originalPrice <= basePrice) {
            originalPrice = basePrice * 1.67;
        }

        let variants: Product['variants'] = [];
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
                }
            } catch (vError) {
                console.error(`Error fetching variations for product ${id}:`, vError);
            }
        }

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
            rating: parseFloat(p.average_rating || "0"),
            reviews: p.rating_count,
            category: p.categories[0]?.name || "Uncategorized",
            allCategories: p.categories?.map((cat: any) => cat.name) || [],
            description: p.description,
            supplier,
            externalId,
            attributes: p.attributes?.map(attr => ({
                name: attr.name,
                options: attr.options
            })),
            variants,
            buyerReviews: realReviews
        };
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
}

export async function getRelatedProducts(categoryId: string, currentProductId: string): Promise<Product[]> {
    try {
        const products = await getProducts({ category: categoryId, per_page: 5 });
        return products.filter(p => p.id !== currentProductId).slice(0, 4);
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
                finalImage = (!c.image || isPlaceholder) ? `https://source.unsplash.com/400x400/?${encodeURIComponent(niceName)}+product` : c.image;
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
            image: c.image?.src || `https://source.unsplash.com/400x400/?${encodeURIComponent(c.name)}+product`
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

