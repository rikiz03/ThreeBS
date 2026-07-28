'use client';

import { useCartStore, useSettingsStore } from '@/lib/store';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Lock, CreditCard, Loader2, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { formatPrice } from '@/lib/geo';

const StripeCheckout = dynamic(() => import('@/components/StripeCheckout'), { ssr: false });
const PayPalButton = dynamic(() => import('@/components/PayPalButton'), { ssr: false });

export default function CheckoutPage() {
    const { items, removeItem, updateQuantity, total, clearCart, shippingFee, setShippingFee } = useCartStore();
    const { currency, countryCode, setCountryCode } = useSettingsStore();
    const { user } = useUser();
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState(1); // 1: Cart, 2: Shipping, 3: Payment
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [city, setCity] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [termsError, setTermsError] = useState<string | null>(null);

    // Automatically calculate shipping when country or items change
    useEffect(() => {
        const calculateShipping = async () => {
            if (items.length === 0) return;
            
            setIsCalculatingShipping(true);
            try {
                const res = await fetch('/api/shipping/calculate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items, countryCode })
                });
                const data = await res.json();
                if (data.fee !== undefined) {
                    setShippingFee(data.fee);
                }
            } catch (error) {
                console.error('Shipping calc failed:', error);
            } finally {
                setIsCalculatingShipping(false);
            }
        };

        if (mounted) {
            calculateShipping();
        }
    }, [countryCode, items, mounted, setShippingFee]);

    useEffect(() => {
        if (user) {
            setEmail(user.primaryEmailAddress?.emailAddress || '');
        }
    }, [user]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Abandoned Cart Trigger
    useEffect(() => {
        if (!email || items.length === 0 || step < 2) return;

        const timer = setTimeout(async () => {
            try {
                await fetch('/api/cart/abandoned', {
                    method: 'POST',
                    body: JSON.stringify({
                        email,
                        items,
                        total: total(),
                        fullName,
                        countryCode
                    })
                });
            } catch (e) {
                console.error('Abandoned cart log failed', e);
            }
        }, 2000); // Debounce by 2 seconds

        return () => clearTimeout(timer);
    }, [email, items, total, fullName, countryCode, step]);


    const syncOrder = async (orderId: string) => {
        try {
            await fetch('/api/fulfillment/sync-order', {
                method: 'POST',
                body: JSON.stringify({
                    orderId: orderId,
                    fullName,
                    city,
                    countryCode,
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
        } catch (syncError) {
            console.error('Fulfillment sync failed:', syncError);
        }
    };

    // Calculate display shipping fee (subtracting the $10 already built into product prices)
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    const displayShippingFee = Math.max(0, shippingFee - (10 * totalQuantity));
    const orderTotal = total() + displayShippingFee;

    if (!mounted) return <div className="p-10 dark:bg-[#0a0a0a] dark:text-white">Loading...</div>;

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center dark:bg-[#0a0a0a] dark:text-white">
                <h1 className="text-2xl font-bold mb-4">Your Shopping Cart is empty.</h1>
                <p className="mb-8 text-gray-600 dark:text-gray-400">
                    Your shopping cart lives to serve. Give it purpose — fill it with
                    groceries, electronics, fashion, home essentials and more.
                </p>
                <Link href="/" className="text-blue-600 hover:underline">
                    Continue shopping at Three Brothers&apos; Stores
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen pb-20 dark:text-white transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-medium mb-6 dark:text-white">Checkout ({items.length} items)</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">

                        {/* Step 1: Review Items */}
                        <div className={`bg-white dark:bg-gray-900/40 rounded-lg shadow-sm border dark:border-gray-800 p-6 ${step > 1 ? 'border-l-4 border-l-green-500' : 'border-gray-200'}`}>
                            <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setStep(1)}>
                                <h2 className={`text-lg font-bold ${step === 1 ? 'text-orange-700 dark:text-orange-500' : 'text-gray-800 dark:text-gray-200'}`}>1. Review items and shipping</h2>
                                {step > 1 && <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Change</span>}
                            </div>

                            {(step === 1) && (
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0">
                                            <div className="relative w-24 h-24 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg p-2">
                                                <Image src={item.image} alt={item.title} fill className="object-contain" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1 leading-tight">{item.title}</h3>
                                                <p className="text-green-700 dark:text-green-500 text-sm font-medium mb-2">In Stock</p>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">Qty: {item.quantity}</span>
                                                    <button 
                                                        onClick={() => removeItem(item.id)} 
                                                        className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1 transition-colors group"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                                        <span>Remove</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-right font-bold text-gray-900 dark:text-white">
                                                {formatPrice(item.price, currency)}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setStep(2)}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-xl shadow-md transition-all active:scale-95"
                                    >
                                        Proceed to checkout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Shipping Address */}
                        <div className={`bg-white dark:bg-gray-900/40 rounded-lg shadow-sm border dark:border-gray-800 p-6 ${step > 2 ? 'border-l-4 border-l-green-500' : 'border-gray-200'}`}>
                            <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => step > 2 && setStep(2)}>
                                <h2 className={`text-lg font-bold ${step === 2 ? 'text-orange-700 dark:text-orange-500' : 'text-gray-800 dark:text-gray-200'}`}>2. Shipping address</h2>
                                {step > 2 && <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Change</span>}
                            </div>

                            {step === 2 && (
                                <div className="space-y-4">
                                    <SignedOut>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md text-sm text-blue-800 dark:text-blue-300 mb-4 border border-blue-100 dark:border-blue-900/30">
                                            Please <SignInButton><span className="font-bold underline cursor-pointer">sign in</span></SignInButton> to save your address.
                                        </div>
                                    </SignedOut>

                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                placeholder="Required for payment"
                                                className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-gray-800 dark:text-white"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Country / Region</label>
                                            <select
                                                value={countryCode}
                                                onChange={(e) => setCountryCode(e.target.value)}
                                                className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-gray-800 dark:text-white"
                                            >
                                                <option value="US">United States (Free Shipping)</option>
                                                <option value="GB">United Kingdom</option>
                                                <option value="NG">Nigeria</option>
                                                <option value="CA">Canada</option>
                                                <option value="AU">Australia</option>
                                                <option value="FR">France (Free Shipping)</option>
                                                <option value="DE">Germany (Free Shipping)</option>
                                                <option value="ES">Spain (Free Shipping)</option>
                                                <option value="IT">Italy (Free Shipping)</option>
                                                <option value="ZA">South Africa</option>
                                                <option value="KE">Kenya</option>
                                                <option value="GH">Ghana</option>
                                            </select>
                                            <p className="text-[10px] text-gray-500 mt-1">Free shipping for USA and EU. Differential rates applied to other regions.</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                            <input 
                                                type="text" 
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-gray-800 dark:text-white" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                                            <input type="text" className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-gray-800 dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">City</label>
                                            <input 
                                                type="text" 
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-gray-800 dark:text-white" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">State / Zip Code</label>
                                            <input type="text" className="w-full border border-gray-300 dark:border-gray-700 rounded p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-gray-800 dark:text-white" />
                                        </div>
                                    </form>
                                    <button
                                        onClick={() => {
                                            if (!email) {
                                                alert("Please enter your email address for payment verification.");
                                                return;
                                            }
                                            setStep(3);
                                        }}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-xl shadow-md transition-all active:scale-95 mt-4"
                                    >
                                        Use this address
                                    </button>

                                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
                                        You will be asked to confirm the Terms of Service and Return Policy before completing payment.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 3: Payment */}
                        <div className={`bg-white dark:bg-gray-900/40 rounded-lg shadow-sm border dark:border-gray-800 p-6 ${step === 3 ? 'border-l-4 border-l-orange-500' : 'border-gray-200'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className={`text-lg font-bold ${step === 3 ? 'text-orange-700 dark:text-orange-500' : 'text-gray-800 dark:text-gray-200'}`}>3. Payment method</h2>
                            </div>

                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                                        <button
                                            onClick={() => setPaymentMethod('stripe')}
                                            className={`flex-1 p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${paymentMethod === 'stripe' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 ring-1 ring-purple-600' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-gray-800'}`}
                                        >
                                            <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-full"><CreditCard className="w-5 h-5 text-purple-700 dark:text-purple-400" /></div>
                                            <span className="font-bold text-gray-800 dark:text-gray-100 text-center">Credit / Debit Card</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Visa, Mastercard, Amex + Apple Pay & Google Pay</span>
                                        </button>

                                        <button
                                            onClick={() => setPaymentMethod('paypal')}
                                            className={`flex-1 p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-600' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-gray-800'}`}
                                        >
                                            <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full">
                                                <span className="text-blue-700 dark:text-blue-400 font-bold text-lg">P</span>
                                            </div>
                                            <span className="font-bold text-gray-800 dark:text-gray-100 text-center">PayPal</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Pay with your PayPal account</span>
                                        </button>
                                    </div>

                                    <div className="border border-blue-600 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md flex items-start gap-3">
                                        <div className="mt-1"><Lock className="w-4 h-4 text-blue-700 dark:text-blue-400" /></div>
                                        <p className="text-sm text-blue-800 dark:text-blue-300">
                                            Your payment is secure and encrypted. We use industry-standard SSL encryption for all transactions. No card details are stored on our servers.
                                        </p>
                                    </div>

                                    {isVerifying ? (
                                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                            <p className="text-gray-500 font-medium">Verifying payment...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mt-6">
                                                {paymentMethod === 'stripe' ? (
                                                    <StripeCheckout
                                                        orderId={`ORD-TX-${Date.now()}`}
                                                        amount={orderTotal}
                                                        email={email}
                                                        fullName={fullName}
                                                        city={city}
                                                    />
                                                ) : (
                                                    <PayPalButton
                                                        orderId={`ORD-TX-${Date.now()}`}
                                                        amount={orderTotal}
                                                        email={email}
                                                        fullName={fullName}
                                                        city={city}
                                                    />
                                                )}
                                            </div>

                                            <div className="mt-6 border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/20 rounded-lg p-4">
                                                <label className="flex items-start gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={agreeToTerms}
                                                        onChange={(e) => {
                                                            setAgreeToTerms(e.target.checked);
                                                            if (e.target.checked) setTermsError(null);
                                                        }}
                                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                                                        required
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                        I have read and agree to the{' '}
                                                        <Link href="/terms-conditions" className="text-blue-600 dark:text-blue-400 hover:underline">
                                                            Terms of Service
                                                        </Link>{' '}
                                                        and{' '}
                                                        <Link href="/refund-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                                                            Return Policy
                                                        </Link>{' '}
                                                        .
                                                        <span className="block mt-1">
                                                            View our{' '}
                                                            <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                                                                Privacy Policy
                                                            </Link>
                                                        </span>
                                                    </span>
                                                </label>

                                                {termsError && (
                                                    <p className="mt-2 text-[12px] text-red-600 dark:text-red-400 font-medium">
                                                        {termsError}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-900/40 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
                            <button
                                onClick={() => {
                                    if (step === 3) {
                                        if (!agreeToTerms) {
                                            setTermsError('Please confirm that you agree to the Terms of Service and Return Policy to complete your order.');
                                            return;
                                        }
                                        alert("Please complete payment using the method selected.");
                                        return;
                                    }
                                    setStep(step + 1);
                                }}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 mb-4 text-sm"
                            >
                                {step === 3 ? 'Step 3: Complete Payment' : 'Proceed to checkout'}
                            </button>

                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">
                                By placing your order, you agree to Three Brothers&apos; Stores&apos; <a href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">privacy notice</a> and <a href="/terms-conditions" className="text-blue-600 dark:text-blue-400 hover:underline">conditions of use</a>.
                            </p>

                            <h3 className="font-bold text-lg mb-4 dark:text-white">Order Summary</h3>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex justify-between">
                                    <span>Items ({items.length}):</span>
                                    <span className="text-gray-900 dark:text-gray-100 font-medium">{formatPrice(total(), currency)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping & handling:</span>
                                    {isCalculatingShipping ? (
                                        <div className="flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                                            <span className="text-xs">Calculating...</span>
                                        </div>
                                    ) : (
                                        <span className={displayShippingFee > 0 ? 'text-gray-900 dark:text-white font-bold' : 'text-green-700 dark:text-green-500 font-bold'}>
                                            {displayShippingFee > 0 ? formatPrice(displayShippingFee, currency) : 'FREE'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span>Total before tax:</span>
                                    <span className="text-gray-900 dark:text-gray-100">{formatPrice(total() + displayShippingFee, currency)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Estimated tax:</span>
                                    <span className="text-gray-900 dark:text-gray-100">{formatPrice(0, currency)}</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between font-bold text-red-700 dark:text-red-500 text-lg">
                                    <span>Order Total:</span>
                                    <span>{formatPrice(orderTotal, currency)}</span>
                                </div>
                            </div>
                            
                            {displayShippingFee === 0 && (
                                <div className="mt-4 p-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded text-[10px] text-green-700 dark:text-green-400 text-center font-bold">
                                    You saved {formatPrice(10 * totalQuantity, currency)} on shipping!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
