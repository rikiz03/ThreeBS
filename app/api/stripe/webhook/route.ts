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
                const metadata = session.metadata || {};
                const orderId = metadata.orderId;
                const fullName = metadata.fullName || 'Guest';
                const city = metadata.city || 'Unknown';
                const amountTotal = (session.amount_total || 0) / 100; // Convert cents to dollars

                console.log(`Payment succeeded for order: ${orderId}`);

                // Reconstruct the purchased items from per-item metadata so the
                // store-owner email includes line items instead of an empty list.
                const itemCount = Math.min(parseInt(metadata.itemCount || '0', 10) || 0, 40);
                const emailItems: Array<{ title: string; quantity: number }> = [];
                for (let i = 1; i <= itemCount; i++) {
                    const raw = metadata[`items_${i}`];
                    if (!raw) continue;
                    try {
                        const parsed = JSON.parse(raw);
                        emailItems.push({
                            title: parsed.title || `Item ${i}`,
                            quantity: parsed.quantity || 1,
                        });
                    } catch (parseError) {
                        console.error('Stripe webhook: could not parse item metadata', parseError);
                    }
                }

                // Send email notification to store owner
                sendEmailNotification({
                    orderId: orderId || session.id,
                    total: amountTotal,
                    fullName,
                    city,
                    countryCode: 'US',
                    items: emailItems
                }).catch((err: unknown) => console.error('Email notification failed:', err));

                break;
            }
            case 'checkout.session.expired': {
                const expiredSession = event.data.object;
                console.log(`Checkout session expired: ${expiredSession.id}`);
                break;
            }
            case 'payment_intent.payment_failed': {
                const failedIntent = event.data.object;
                console.log(`Payment failed for PaymentIntent: ${failedIntent.id}, order: ${failedIntent.metadata?.orderId || 'unknown'}`);
                // Notify the store owner about the failed payment so they can follow up with the customer
                sendEmailNotification({
                    orderId: failedIntent.metadata?.orderId || failedIntent.id,
                    total: (failedIntent.amount || 0) / 100,
                    fullName: failedIntent.metadata?.fullName || 'Guest',
                    city: failedIntent.metadata?.city || 'Unknown',
                    countryCode: 'US',
                    items: []
                }).catch((err: unknown) => console.error('Failed-payment email notification failed:', err));
                break;
            }
            case 'charge.dispute.created': {
                const dispute = event.data.object;
                console.log(`Dispute created: ${dispute.id} for charge ${dispute.charge}`);
                // Fees are deducted by Stripe; alert the store owner about a chargeback so they can respond
                sendEmailNotification({
                    orderId: dispute.payment_intent || dispute.id,
                    total: (dispute.amount || 0) / 100,
                    fullName: dispute.billing_details?.name || 'Guest',
                    city: dispute.billing_details?.address?.city || 'Unknown',
                    countryCode: dispute.billing_details?.address?.country || 'US',
                    items: []
                }).catch((err: unknown) => console.error('Dispute email notification failed:', err));
                break;
            }
            case 'charge.refunded': {
                const refund = event.data.object;
                console.log(`Charge refunded: ${refund.id}, status: ${refund.status}`);
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
