import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side translation endpoint.
 *
 * Calls the Google Cloud Translation v2 REST API using the server-only
 * GOOGLE_TRANSLATE_API_KEY env var (never exposed to the browser).
 * If no key is configured it returns the original text so the app keeps
 * working in English without any error.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const text: string = typeof body?.text === 'string' ? body.text.trim() : '';
        const target: string = typeof body?.target === 'string' ? body.target : '';

        if (!text) return NextResponse.json({ translated: '' });
        if (target === 'en' || !target) return NextResponse.json({ translated: text });

        const GOOGLE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
        if (!GOOGLE_API_KEY) {
            // No key configured -> fall back to the original text (English).
            return NextResponse.json({ translated: text, skipped: 'no_key' });
        }

        const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(GOOGLE_API_KEY)}`;

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                target,
                format: 'text',
            }),
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error('Translate API error', res.status, errText);
            return NextResponse.json({ translated: text, error: `upstream_${res.status}` });
        }

        const data = await res.json();
        const translated = data?.data?.translations?.[0]?.translatedText;
        return NextResponse.json({ translated: translated || text });
    } catch (e) {
        console.error('Translate route error', e);
        return NextResponse.json({ translated: '' });
    }
}