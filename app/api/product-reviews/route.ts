import { NextRequest, NextResponse } from 'next/server';
import { getWooCommerceClient } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

// POST /api/product-reviews
// Persists a buyer-submitted review into the shared WooCommerce store so it's
// visible to all visitors and can be aggregated by the Areviews plugin.
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, rating, author, comment } = body;

        const productNum = productId !== undefined ? parseInt(String(productId), 10) : NaN;
        const ratingNum = rating !== undefined ? parseInt(String(rating), 10) : 0;
        const name = (author || '').trim();
        const reviewText = (comment || '').trim();

        if (isNaN(productNum) || productNum <= 0) {
            return NextResponse.json({ error: 'A valid product ID is required' }, { status: 400 });
        }
        if (ratingNum < 1 || ratingNum > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }
        if (!reviewText) {
            return NextResponse.json({ error: 'Review comment is required' }, { status: 400 });
        }

        const client = getWooCommerceClient();
        if (!client) {
            return NextResponse.json(
                { error: 'Review storage is not configured (WooCommerce credentials missing)' },
                { status: 503 }
            );
        }

        // WooCommerce REST API: POST /products/reviews
        const created = await client.post('products/reviews', {
            product_id: productNum,
            review: reviewText,
            reviewer: name || 'Verified Buyer',
            rating: ratingNum,
            verified: true,
        });

        return NextResponse.json({ success: true, review: created });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Create product review error:', errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}