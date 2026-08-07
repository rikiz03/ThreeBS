'use client';

import { useState, useEffect } from 'react';
import { Truck, Lock, AlertCircle, Loader2, Check, ShieldCheck, Minus, Plus, Zap } from 'lucide-react';
import { useCartStore, useSettingsStore } from '@/lib/store';
import { formatPrice } from '@/lib/geo';
import { Product } from '@/lib/types';
import Image from 'next/image';

interface BuyBoxProps {
    product: Product;
}

export default function BuyBox({ product }: BuyBoxProps) {
    const { addItem, setCurrentShippingFee, setCurrentBasePrice, setCurrentProductImage, setCurrentExtraShipping, setCurrentShippingTime } = useCartStore();
    const { currency, countryCode } = useSettingsStore();
    
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [shippingFee, setShippingFee] = useState<number | null>(null);
    const [shippingTime, setShippingTime] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setCurrentProductImage(selectedVariant?.image || product.image);
    }, [selectedVariant, product.image, setCurrentProductImage]);

    // Initialize selected attributes based on the variant that matches the homepage price/image
    useEffect(() => {
        if (product.attributes && product.attributes.length > 0) {
            const initial: Record<string, string> = {};
            
            // Search for the variant that matches the product image or price (from homepage)
            const bestMatch = product.variants?.find(v => v.image === product.image) 
                           || product.variants?.find(v => Math.abs(v.price - product.price) < 0.01)
                           || (product.variants && product.variants[0]);

            if (bestMatch) {
                bestMatch.attributes.forEach((attr: any) => {
                    initial[attr.name] = attr.option;
                });
            } else {
                product.attributes.forEach(attr => {
                    initial[attr.name] = attr.options[0];
                });
            }
            setSelectedAttributes(initial);
        }
    }, [product]);

    // Helper to find an image for a specific attribute option (e.g. for Color)
    const getOptionImage = (attrName: string, option: string) => {
        const variant = product.variants?.find(v => 
            v.attributes.some(a => a.name === attrName && a.option === option)
        );
        return variant?.image;
    };

    // Helper to find the price for a specific attribute option, considering current selections
    const getOptionPrice = (attrName: string, option: string): number | null => {
        if (!product.variants || product.variants.length === 0) return null;

        // Build candidate selections: current selections for all attributes, but override this one
        const candidateAttrs: Record<string, string> = {
            ...selectedAttributes,
            [attrName]: option
        };

        // Find the variant whose attributes match all candidate selections
        const match = product.variants.find(v => 
            v.attributes.every(a => candidateAttrs[a.name] === a.option)
        );

        return match ? match.price : null;
    };

    // Find matching variant when attributes change
    useEffect(() => {
        if (product.variants && product.variants.length > 0) {
            const match = product.variants.find(v => 
                v.attributes.every(attr => selectedAttributes[attr.name] === attr.option)
            );
            setSelectedVariant(match || null);
        }
    }, [selectedAttributes, product.variants]);

    useEffect(() => {
        async function fetchShipping() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/shipping/calculate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        countryCode,
                        items: [{
                            supplier: product.supplier,
                            externalId: product.externalId,
                            quantity: 1
                        }]
                    })
                });

                const data = await response.json();
                if (!response.ok) {
                    if (data.error === 'PRODUCT_NOT_AVAILABLE') {
                        setError('This product is not available in your region.');
                    } else {
                        setError('Shipping calculation failed.');
                    }
                } else {
                    const extra = Math.max(0, data.fee - 10);
                    setShippingFee(data.fee);
                    setCurrentShippingFee(data.fee);
                    setCurrentExtraShipping(extra);
                    setCurrentShippingTime(data.shippingTime);
                    setShippingTime(data.shippingTime);
                }
            } catch (err) {
                console.error('Shipping fetch error:', err);
                setError('Unable to calculate shipping.');
            } finally {
                setLoading(false);
            }
        }

        fetchShipping();

        return () => {
            setCurrentShippingFee(0);
            setCurrentBasePrice(0);
            setCurrentProductImage('');
            setCurrentExtraShipping(0);
            setCurrentShippingTime('');
        };
    }, [countryCode, product.id, product.externalId, product.supplier, setCurrentShippingFee, setCurrentProductImage, setCurrentExtraShipping, setCurrentShippingTime]);

    const basePrice = selectedVariant ? selectedVariant.price : product.price;
    
    useEffect(() => {
        setCurrentBasePrice(basePrice);
    }, [basePrice, setCurrentBasePrice]);

    // We subtract the $10 estimate already included in the basePrice from the actual shippingFee
    const extraShipping = Math.max(0, (shippingFee || 0) - 10);
    const finalPrice = basePrice + extraShipping;
    const totalPrice = finalPrice * quantity;

    const handleAddToCart = () => {
        if (error) return;
        
        addItem({
            id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
            title: selectedVariant ? `${product.title} (${selectedVariant.attributes.map((a: any) => a.option).join(', ')})` : product.title,
            price: basePrice,
            image: selectedVariant?.image || product.image,
            quantity,
            supplier: product.supplier,
            externalId: product.externalId
        });
        alert('Added to Cart!');
    };

    if (loading) {
        return (
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm bg-white dark:bg-[#121212] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#0E5B3D]" />
                <p className="text-sm text-gray-500">Calculating best shipping rates...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border border-red-200 rounded-2xl p-6 bg-red-50 dark:bg-red-900/10 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center gap-3 text-red-700 dark:text-red-400 font-bold">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="block text-lg">Regional Restriction</span>
                        <span className="block text-xs font-normal opacity-70">Logistics Limitation</span>
                    </div>
                </div>
                <div className="h-px bg-red-200 dark:bg-red-800/30 w-full"></div>
                <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">
We apologize, but this product is currently <b>exclusive to our USA Warehouse</b> and cannot be shipped to <b>{countryCode}</b> at this time.
                </p>
                <div className="mt-2 p-3 bg-white/50 dark:bg-black/20 rounded-lg text-xs text-red-500 font-medium">
{`Please browse our "Global Hub" category for items available for international tracked delivery to your region.`}
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm bg-white dark:bg-[#121212]">
            {/* Price Header - AliExpress style */}
            <div className="bg-[#0E5B3D]/5 dark:bg-[#0E5B3D]/10 rounded-xl p-4 mb-4 flex items-center gap-3">
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-[#0E5B3D] dark:text-[#74D644]">
                            {formatPrice(finalPrice, currency)}
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.originalPrice + (shippingFee || 0), currency)}
                            </span>
                        )}
                    </div>
                    {product.originalPrice && (
                        <div className="mt-1 inline-block bg-[#74D644] text-[#0E5B3D] text-[10px] font-black px-2 py-0.5 rounded">
                            SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile-Only Product Image */}
            <div className="md:hidden relative aspect-square w-full mb-6 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-inner">
                <Image
                    src={selectedVariant?.image || product.image}
                    alt={product.title}
                    fill
                    unoptimized
                    className="object-contain p-4"
                    priority
                />
            </div>

            {/* Selection UI - AliExpress order */}
            {product.attributes && product.attributes.length > 0 && (
                <div className="space-y-5 mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                    {product.attributes.map((attr) => {
                        const isColor = attr.name.toLowerCase().includes('color') || attr.name.toLowerCase().includes('colour');
                        
                        return (
                            <div key={attr.name}>
                                <div className="flex justify-between items-center mb-2.5">
                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-200">
                                        {attr.name}: <span className="text-[#0E5B3D] dark:text-[#74D644] font-black">{selectedAttributes[attr.name]}</span>
                                    </label>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {attr.options.map((opt) => {
                                        const optImage = isColor ? getOptionImage(attr.name, opt) : null;
                                        const isActive = selectedAttributes[attr.name] === opt;
                                        
                                        if (optImage) {
                                            const optionPrice = getOptionPrice(attr.name, opt);
                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => setSelectedAttributes(prev => ({ ...prev, [attr.name]: opt }))}
                                                    className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
                                                        isActive 
                                                        ? 'border-[#0E5B3D] ring-2 ring-[#0E5B3D]/20 shadow-md' 
                                                        : 'border-gray-100 hover:border-gray-300'
                                                    }`}
                                                    title={opt}
                                                >
                                                    <Image 
                                                        src={optImage} 
                                                        alt={opt} 
                                                        fill 
                                                        unoptimized
                                                        className="object-cover"
                                                    />
                                                    {isActive && (
                                                        <div className="absolute inset-0 bg-[#0E5B3D]/10 flex items-center justify-center">
                                                            <Check className="w-5 h-5 text-[#0E5B3D] drop-shadow-sm" />
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        }

                                        const optionPrice = getOptionPrice(attr.name, opt);
                                        return (
                                            <button
                                                key={opt}
                                                onClick={() => setSelectedAttributes(prev => ({ ...prev, [attr.name]: opt }))}
                                                className={`px-4 py-2 text-xs rounded-lg border transition-all hover:bg-gray-50 active:scale-95 ${
                                                    isActive
                                                        ? 'border-[#0E5B3D] bg-[#0E5B3D] text-white ring-1 ring-[#0E5B3D] font-bold'
                                                        : 'border-gray-200 text-gray-600 bg-white'
                                                }`}
                                            >
                                                {opt}
                                                {optionPrice && (
                                                    <span className={`ml-1.5 text-[10px] font-black ${isActive ? 'text-[#74D644]' : 'text-gray-400'}`}>
                                                        {formatPrice(optionPrice, currency)}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Quantity Selector - AliExpress style */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Quantity</span>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-2 py-1">
                    <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-7 h-7 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-[#0E5B3D] hover:text-[#0E5B3D] transition-colors"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-black text-gray-900 dark:text-white">{quantity}</span>
                    <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-7 h-7 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-[#0E5B3D] hover:text-[#0E5B3D] transition-colors"
                        aria-label="Increase quantity"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Shipping & Warranty Info - AliExpress box */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 p-3 mb-6">
<div className="flex items-center gap-2 text-[#0E5B3D] dark:text-[#74D644] font-bold text-sm">
                    <Truck className="w-4 h-4" /> Worldwide Shipping Included
                </div>
                {shippingTime && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5 ml-1">
                        <Zap className="w-3.5 h-3.5 text-[#74D644]" />
                        Estimated delivery: <span className="font-bold text-gray-700 dark:text-gray-300">{shippingTime} days</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1.5 ml-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> No warranty provided
                </div>
            </div>

            {/* Buy Buttons - Brand colors */}
            <div className="space-y-3">
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#0E5B3D] hover:bg-[#0a4a33] text-white font-black py-4 rounded-full transition-all shadow-lg active:scale-95 uppercase tracking-wide"
                >
                    Add to Cart
                </button>
                
                <button
                    onClick={() => {
                        handleAddToCart();
                        window.location.href = '/checkout';
                    }}
                    className="w-full bg-[#74D644] hover:bg-lime-400 text-[#0E5B3D] font-black py-4 rounded-full transition-all shadow-md active:scale-95 uppercase tracking-wide"
                >
                    Buy Now
                </button>
            </div>

            {/* Total row */}
            <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">Total ({quantity} item{quantity > 1 ? 's' : ''})</span>
                <span className="text-lg font-black text-[#0E5B3D] dark:text-[#74D644]">{formatPrice(totalPrice, currency)}</span>
            </div>

            {/* Trust badges */}
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-2 text-[10px] font-bold text-gray-500 text-center">
                <div className="flex flex-col items-center gap-1">
                    <Lock className="w-4 h-4 text-[#0E5B3D]" />
                    <span>Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#0E5B3D]" />
                    <span>30-Day Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-[#0E5B3D]" />
                    <span>Tracked Shipping</span>
                </div>
            </div>
        </div>
    );
}
