import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { orderId, amount, email, fullName, city, items } = await req.json();

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

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            customer_email: email,
            metadata: {
                orderId,
                fullName,
                city,
            },
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout`,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error('Stripe Create Payment Intent Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
