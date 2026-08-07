'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useSettingsStore } from '@/lib/store';
import { formatPrice } from '@/lib/geo';

export default function Hero() {
    const { t } = useTranslation();
    const { currency } = useSettingsStore();
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Main Banner */}
            <div className="lg:col-span-2 relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-r from-blue-900 to-blue-600 text-white p-12 flex flex-col justify-center">
                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl font-bold mb-4">{t('iphone_title')}</h1>
                    <p className="text-xl mb-6">{t('from')} {formatPrice(1199, currency)}</p>
                    <p className="text-blue-100 mb-8 max-w-sm">
                        {t('iphone_desc')}
                    </p>
                    <Link href="/category/electronics" className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors">
                        {t('shop_now')} <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full">
                    <Image
                        src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600&h=800"
                        alt="iPhone 15 Pro"
                        fill
                        className="object-cover object-center mix-blend-overlay opacity-50"
                    />
                </div>
            </div>

            {/* Side Banner */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gray-100 group">
                <Image
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600&h=800"
                    alt="Running Shoes"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 p-8 flex flex-col justify-end text-white">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">{t('sale')}</span>
                    <div className="text-5xl font-bold mb-2">50% <span className="text-2xl">{t('off')}</span></div>
                    <h3 className="text-xl font-medium mb-4">{t('shoes_title')}</h3>
                    <Link href="/category/sports-gear" className="text-white underline hover:text-blue-400">{t('shop_sale')}</Link>
                </div>
            </div>
        </div>
    );
}
