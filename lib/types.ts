export interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    images?: string[];
    rating: number;
    reviews: number;
    badge?: string;
    category: string;
    allCategories?: string[];
    description?: string;
    supplier?: Supplier;
    externalId?: string;
    attributes?: {
        name: string;
        options: string[];
    }[];
    variants?: {
        id: string;
        price: number;
        image?: string;
        attributes: {
            name: string;
            option: string;
        }[];
    }[];
    buyerReviews?: Review[];
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
    images?: string[];
    verified: boolean;
}

export type Supplier = 'CJ' | 'DSERS' | 'EPROLO' | 'UNKNOWN';

export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
}
