'use client';

import { useSettingsStore } from '@/lib/store';
import { useTranslatedText } from '@/lib/translate';

/**
 * Renders `text`, automatically translated into the current site language.
 * Use this in server components (e.g. product titles) or anywhere you have
 * dynamic/English text that isn't covered by the static i18n dictionary.
 */
export default function TranslatedText({ text }: { text: string }) {
    const locale = useSettingsStore((s) => s.locale);
    const out = useTranslatedText(text, locale);
    return <>{out}</>;
}