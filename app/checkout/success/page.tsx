'use client';

import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore, useSettingsStore } from '@/lib/store';
import { trackEvent } from '@/lib/analytics';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    
    const { items, total, checkoutDetails, clearCart } = useCartStore();
    const { countryCode } = useSettingsStore();
    const [isSyncing, setIsSyncing] = useState(true);
    const hasSynced = useRef(false);

    useEffect(() => {
        const syncOrder = async () => {
            if (hasSynced.current) return;
            
            hasSynced.current = true;

            // Determine order ID from session or checkout details
            const orderId = checkoutDetails?.orderId || sessionId || ('ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase());
            const fullName = checkoutDetails?.fullName || 'Guest';
            const city = checkoutDetails?.city || '';
            
            // Sync order to fulfillment if we have items
            if (items.length > 0) {
                try {
                    await fetch('/api/fulfillment/sync-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            orderId,
                            fullName,
                            city,
                            countryCode: countryCode,
                            total: total(),
                            items: items.map(item => ({
                                productId: item.id,
                                title: item.title,
                                quantity: item.quantity,
                                supplier: item.supplier || 'UNKNOWN',
                                externalProductId: item.externalId || ''
                            }))
                        }),
                    });
                } catch (error) {
                    console.error('Fulfillment sync failed:', error);
                }
            }

            // Track event
            try {
                trackEvent({
                    type: 'purchase',
                    orderId,
                });
            } catch (e) {
                console.error('Analytics tracking failed:', e);
            }

            // Clear the cart
            clearCart();
            setIsSyncing(false);
        };

        syncOrder();
    }, [checkoutDetails, items, total, countryCode, clearCart, sessionId]);

    return (
        <div className="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen py-20 transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white dark:bg-gray-900/40 rounded-3xl shadow-xl p-10 text-center border border-gray-100 dark:border-gray-800">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>

                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Order Placed!</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                        Thank you for your purchase. We&apos;ve sent a confirmation email to your registered address.
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-10 text-left border dark:border-gray-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                {isSyncing ? (
                                    <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
                                ) : (
                                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Order Status</p>
                                <p className="font-bold text-gray-800 dark:text-gray-100">
                                    {isSyncing ? 'Synchronizing with Suppliers...' : 'Processing & Synced'}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            We are currently processing your order and syncing details with our global fulfillment partners.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Link
                            href="/"
                            className="bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                            Continue Shopping <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-500 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            View Order Details
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-400 text-sm">
                        Need help? <Link href="/contact-us" className="text-blue-500 hover:underline">Contact our support team</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
