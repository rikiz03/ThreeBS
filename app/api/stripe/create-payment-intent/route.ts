import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { orderId, amount, email, fullName, city, items, shipping, billing } = await req.json();

        if (!orderId || !amount) {
            return NextResponse.json({ error: 'Order ID and amount are required' }, { status: 400 });
        }

        // Stripe Checkout Session creation
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeSecretKey) {
            console.warn('STRIPE_SECRET_KEY not configured. Returning mock redirect for development.');
            // Return a mock success URL for development until Stripe keys are configured
            return NextResponse.json({
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success?session_id=mock_${orderId}`
            });
        }

        // Dynamically import Stripe to avoid issues when key is not set
        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(stripeSecretKey);

        // Build line items from cart
        const lineItems = items.map((item: { title: string; quantity: number; price: number }) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                },
                unit_amount: Math.round(item.price * 100), // Stripe uses cents
            },
            quantity: item.quantity,
        }));

        // Serialize cart items into metadata (Stripe limits each metadata value to 500 chars)
        const serializedItems = items.map((item: { title: string; quantity: number; price: number; supplier?: string; externalId?: string }, index: number) => ({
            id: `${index + 1}_${item.title}`,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            supplier: item.supplier || 'UNKNOWN',
            externalId: item.externalId || ''
        }));

        // Build shipping address if provided
        const shippingAddress = shipping && shipping.line1 ? {
            name: shipping.name || fullName,
            address: {
                line1: shipping.line1,
                line2: shipping.line2 || '',
                city: shipping.city || city,
                state: shipping.state || '',
                postal_code: shipping.postalCode || '',
                country: shipping.country || 'US',
            }
        } : undefined;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            customer_email: email,
            customer_creation: 'always',
            client_reference_id: orderId,
shipping_address_collection: shipping ? undefined : { allowed_countries: ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'NG', 'GH', 'KE', 'ZA'] },
            metadata: {
                orderId,
                fullName: fullName || 'Guest',
                city: city || '',
                items: JSON.stringify(serializedItems).slice(0, 500),
                itemCount: items.length.toString(),
            },
            ...(shippingAddress ? { shipping_address: shippingAddress } : {}),
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout`,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error('Stripe Create Payment Intent Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
