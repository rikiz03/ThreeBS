import { NextRequest, NextResponse } from 'next/server';
import { sendEmailNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('stripe-signature') || '';

        // If Stripe webhook secret is not configured, just acknowledge the event
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        
        let event: Record<string, any>;
        
        if (webhookSecret) {
            try {
                const Stripe = (await import('stripe')).default;
                const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {});
                event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret) as Record<string, any>;
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                console.error('Stripe webhook signature verification failed:', errorMessage);
                return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
            }
        } else {
            // Development mode: parse raw body as JSON
            event = JSON.parse(rawBody);
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const { orderId, fullName, city } = session.metadata || {};
                const amountTotal = (session.amount_total || 0) / 100; // Convert cents to dollars

                console.log(`Payment succeeded for order: ${orderId}`);

                // Send email notification to store owner
                sendEmailNotification({
                    orderId: orderId || session.id,
                    total: amountTotal,
                    fullName: fullName || 'Guest',
                    city: city || 'Unknown',
                    countryCode: 'US',
                    items: []
                }).catch((err: unknown) => console.error('Email notification failed:', err));

                break;
            }
            case 'checkout.session.expired': {
                const expiredSession = event.data.object;
                console.log(`Checkout session expired: ${expiredSession.id}`);
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Stripe Webhook Processing Error:', errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
