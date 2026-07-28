'use client';

import { useState } from 'react';
import { CreditCard, Loader2, Check } from 'lucide-react';
import { useCartStore } from '@/lib/store';

interface StripeCheckoutProps {
    orderId: string;
    amount: number;
    email: string;
    fullName: string;
    city: string;
}

export default function StripeCheckout({ orderId, amount, email, fullName, city }: StripeCheckoutProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const { items, clearCart } = useCartStore();

    const handleStripeCheckout = async () => {
        setIsLoading(true);
        try {
            // 1. Create Payment Intent on the server
            const response = await fetch('/api/stripe/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    amount,
                    email,
                    fullName,
                    city,
                    items: items.map(item => ({
                        title: item.title,
                        quantity: item.quantity,
                        price: item.price
                    }))
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to initialize payment');
            }

            // 2. Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL returned');
            }
        } catch (error) {
            console.error('Stripe Checkout Error:', error);
            alert('Payment failed to initialize. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isComplete) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-green-800 dark:text-green-300 text-lg mb-2">Payment Successful!</h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                    Your order has been placed. You will be redirected shortly.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <button
                onClick={handleStripeCheckout}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 active:scale-95"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <CreditCard className="w-5 h-5" />
                        Pay with Card
                    </>
                )}
            </button>

            <p className="text-[10px] text-center text-gray-400">
                Secure payment via Stripe. Apple Pay & Google Pay available at checkout.
            </p>
        </div>
    );
}
