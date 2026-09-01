import { NextRequest, NextResponse } from 'next/server';

interface CheckoutItem {
    id?: string;
    title: string;
    quantity: number;
    price: number;
    supplier?: string;
    externalId?: string;
}

function buildLineItems(items: CheckoutItem[], amount: number) {
    const goods = items
        .filter((it) => (it.price || 0) > 0 && (it.quantity || 0) > 0)
        .map((it) => ({ title: it.title, quantity: it.quantity, unitCents: Math.round(it.price * 100) }));
    const goodsTotal = goods.reduce((s, g) => s + g.unitCents * g.quantity, 0);
    const amountCents = Math.round(amount * 100);
    const diff = amountCents - goodsTotal;

    const asPrice = (g: { title: string; quantity: number; unitCents: number }) => ({
        quantity: g.quantity,
        price_data: { currency: 'usd', product_data: { name: g.title }, unit_amount: g.unitCents },
    });

    if (goods.length === 0 || diff === 0) return goods.map(asPrice);

    // Ship the leftover (the shipping fee) as its own line so it is collected.
    if (diff > 0) {
        return [
            ...goods.map(asPrice),
            { quantity: 1, price_data: { currency: 'usd', product_data: { name: 'Shipping & handling' }, unit_amount: diff } },
        ];
    }

    // A discount lowered the total below product subtotal. Scale each line so
    // we never charge the customer more than the total they approved.
    const scale = amountCents / goodsTotal;
    let allocated = 0;
    const scaled = goods.map((g) => {
        const unit = Math.round(g.unitCents * g.quantity * scale);
        allocated += unit;
        return { title: g.title, unit };
    });
    const drift = amountCents - allocated;
    if (drift !== 0 && scaled.length) scaled[scaled.length - 1].unit += drift;

    return scaled
        .filter((l) => l.unit > 0)
        .map((l) => ({ quantity: 1, price_data: { currency: 'usd', product_data: { name: l.title }, unit_amount: l.unit } }));
}
export async function POST(req: NextRequest) {
    try {
        const { orderId, amount, email, fullName, city, items, shipping, paymentMethod } = await req.json();

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

        const cartItems: CheckoutItem[] = items ?? [];
        const lineItems = buildLineItems(cartItems, amount);

        // Metadata: store each item under its own key so no single value hits
        // Stripe's 500-char cap, and fulfilment details survive the round trip.
        const metadata: Record<string, string> = {
            orderId,
            fullName: fullName || 'Guest',
            city: city || '',
            itemCount: String(cartItems.length),
        };
        cartItems.slice(0, 40).forEach((item, index) => {
            metadata[`items_${index + 1}`] = JSON.stringify({
                id: item.id || '',
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                supplier: item.supplier || 'UNKNOWN',
                externalId: item.externalId || '',
            });
        });

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

        // PayPal routes through Stripe's native PayPal so the button is honest.
        const wantsPayPal = paymentMethod === 'paypal';
        const paymentMethodTypes: Array<'card' | 'paypal'> = wantsPayPal ? ['card', 'paypal'] : ['card'];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: paymentMethodTypes,
            mode: 'payment',
            line_items: lineItems,
            customer_email: email,
            customer_creation: 'always',
            client_reference_id: orderId,
shipping_address_collection: shipping ? undefined : { allowed_countries: ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'NG', 'GH', 'KE', 'ZA'] },
            metadata,
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
