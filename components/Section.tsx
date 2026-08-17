'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import TranslatedText from './TranslatedText';

interface SectionProps {
    title: string;
    id?: string;
    linkText?: string;
    linkHref?: string;
    children: React.ReactNode;
    className?: string;
}

export default function Section({ title, id, linkText, linkHref = "#", children, className = "" }: SectionProps) {
    const { t } = useTranslation();
    const displayLinkText = linkText || t('view_all');
    return (
        <section id={id} className={`mb-12 ${className}`}>
            <div className="flex flex-row items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex-1 leading-tight"><TranslatedText text={title} /></h2>
                <Link href={linkHref} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold flex items-center hover:bg-blue-100 transition-colors group flex-shrink-0 whitespace-nowrap">
                    {displayLinkText} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
            {children}
        </section>
    );
}
