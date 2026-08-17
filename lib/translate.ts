import { useEffect, useState } from 'react';

// ------------------------------------------------------------------
// Client-side automatic translation with caching.
//
// The actual translation is performed by the server route at /api/translate
// (which calls the Google Cloud Translation API with the server-side key).
// We cache every result both in-memory and in localStorage so repeated text
// (e.g. product titles shown in many cards) is translated only once and
// re-renders instantly. When no API key is configured the server returns the
// original text, so the site gracefully stays in English.
// ------------------------------------------------------------------

const MEMORY_CACHE = new Map<string, string>();
const PREFIX = 'tbs_t9n_';

function readCache(key: string): string | null {
    if (MEMORY_CACHE.has(key)) return MEMORY_CACHE.get(key) as string;
    try {
        if (typeof window !== 'undefined') {
            const stored = window.localStorage.getItem(PREFIX + key);
            if (stored) return stored;
        }
    } catch {
        /* ignore storage access errors */
    }
    return null;
}

function writeCache(key: string, value: string) {
    MEMORY_CACHE.set(key, value);
    try {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(PREFIX + key, value);
        }
    } catch {
        /* ignore storage access errors */
    }
}

/** Translate a single piece of text to `target`. Returns the original on failure. */
export async function translateText(text: string, target: string): Promise<string> {
    if (!text || !text.trim()) return text;
    if (target === 'en') return text;

    const key = `${target}|${text.trim()}`;
    const cached = readCache(key);
    if (cached) return cached;

    try {
        const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text.trim(), target }),
        });
        const data = await res.json();
        const translated = typeof data?.translated === 'string' ? data.translated : '';
        const out = translated ? translated : text;
        writeCache(key, out);
        return out;
    } catch {
        return text;
    }
}

/**
 * React hook: returns `text` immediately, then swaps in the translation once
 * it is available (instant for previously-cached values). Tracks every unique
 * string+language combo only while mounted, so the network cost is minimal.
 */
export function useTranslatedText(text: string, target: string): string {
    const [out, setOut] = useState<string>(text);

    useEffect(() => {
        let active = true;
        if (!text || !text.trim() || target === 'en') {
            setOut(text);
            return;
        }
        const key = `${target}|${text.trim()}`;
        const cached = readCache(key);
        if (cached) {
            setOut(cached);
            return;
        }
        translateText(text, target).then((r) => {
            if (active) setOut(r);
        });
        return () => {
            active = false;
        };
    }, [text, target]);

    return out;
}