import { NextRequest, NextResponse } from 'next/server';
import { SITE_URL, SUPPORT_EMAIL } from '@/lib/site';

/**
 * Handles abandoned cart tracking and potential recovery triggers.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, items, total, fullName, countryCode } = body;

        if (!email || !items || items.length === 0) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // 1. Log the abandoned cart
        console.log(`[Abandoned Cart Log] User: ${email}, Items: ${items.length}, Total: $${total}`);

        // 2. Potentially trigger Resend email (if configured)
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const FROM_EMAIL = SUPPORT_EMAIL;

        if (RESEND_API_KEY) {
            // In a production app, you would delay this by 1-2 hours
            // Using a queue service like Upstash QStash or a simple background job
            console.log(`Ready to send recovery email to ${email} via Resend.`);
            
            /*
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: FROM_EMAIL,
                    to: email,
                    subject: 'We reserved the items in your cart! 📦',
                    html: `
                        <h2>Hello ${fullName || 'there'},</h2>
                        <p>We noticed you left some premium items in your cart. We've reserved them for you for the next 24 hours.</p>
                        <p>Complete your purchase now and use code <strong>PV10</strong> for an extra 10% OFF!</p>
                        <br/>
                        <a href={`${SITE_URL}/checkout`} style="background:#000; color:#fff; padding:12px 24px; text-decoration:none; border-radius:8px; font-weight:bold;">
                            Complete My Purchase
                        </a>
                    `
                })
            });
            */
        }

        return NextResponse.json({ success: true, message: 'Recovery log captured' });
    } catch (error: any) {
        console.error('Abandoned Cart Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
