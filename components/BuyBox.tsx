'use client';

import { useState, useEffect } from 'react';
import { Truck, Lock, AlertCircle, Loader2, ChevronRight, Check, ShieldCheck } from 'lucide-react';
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

    const handleAddToCart = () => {
        if (error) return;
        
        addItem({
            id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
            title: selectedVariant ? `${product.title} (${selectedVariant.attributes.map((a: any) => a.option).join(', ')})` : product.title,
            price: basePrice,
            image: selectedVariant?.image || product.image,
            quantity: 1,
            supplier: product.supplier,
            externalId: product.externalId
        });
        alert('Added to Cart!');
    };

    if (loading) {
        return (
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-sm bg-white dark:bg-[#121212] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
                    Please browse our "Global Hub" category for items available for international tracked delivery to your region.
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm bg-white dark:bg-[#121212]">
            {/* Price Header */}
            <div className="flex items-baseline gap-2 mb-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(finalPrice, currency)}
                </div>
                {product.originalPrice && (
                    <div className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice + (shippingFee || 0), currency)}
                    </div>
                )}
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

            {/* Selection UI */}
            {product.attributes && product.attributes.length > 0 && (
                <div className="space-y-5 mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                    {product.attributes.map((attr) => {
                        const isColor = attr.name.toLowerCase().includes('color') || attr.name.toLowerCase().includes('colour');
                        
                        return (
                            <div key={attr.name}>
                                <div className="flex justify-between items-center mb-2.5">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                        Select {attr.name}
                                    </label>
                                    <span className="text-[11px] font-medium text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                        {selectedAttributes[attr.name]}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {attr.options.map((opt) => {
                                        const optImage = isColor ? getOptionImage(attr.name, opt) : null;
                                        const isActive = selectedAttributes[attr.name] === opt;
                                        
                                        if (optImage) {
                                            const optionPrice = getOptionPrice(attr.name, opt);
                                            return (
                                                <div key={opt} className="flex flex-col items-center gap-1">
                                                    <button
                                                        onClick={() => setSelectedAttributes(prev => ({ ...prev, [attr.name]: opt }))}
                                                        className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-110 active:scale-95 ${
                                                            isActive 
                                                            ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-md' 
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
                                                            <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                                                                <Check className="w-5 h-5 text-blue-600 drop-shadow-sm" />
                                                            </div>
                                                        )}
                                                    </button>
                                                    <span className={`text-[9px] font-bold ${isActive ? 'text-[#0E5B3D]' : 'text-gray-400'}`}>
                                                        {formatPrice(optionPrice ?? basePrice, currency)}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        const optionPrice = getOptionPrice(attr.name, opt);
                                        return (
                                            <div key={opt} className="flex flex-col items-center">
                                                <button
                                                    onClick={() => setSelectedAttributes(prev => ({ ...prev, [attr.name]: opt }))}
                                                    className={`px-4 py-2 text-xs rounded-lg border transition-all hover:bg-gray-50 active:scale-95 ${
                                                        isActive
                                                            ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600 font-bold'
                                                            : 'border-gray-200 text-gray-600 bg-white'
                                                    }`}
                                                >
                                                    {opt}
                                                </button>
                                                <span className={`text-[9px] font-bold mt-0.5 ${isActive ? 'text-[#0E5B3D]' : 'text-gray-400'}`}>
                                                    {formatPrice(optionPrice ?? basePrice, currency)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Shipping & Warranty Info */}
            <div className="text-sm text-gray-500 mb-6 flex flex-col gap-2 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                <span className="text-teal-600 font-medium flex items-center gap-1">
                    <Truck className="w-4 h-4" /> Free Worldwide Shipping
                </span>
                <span className="text-[11px] text-gray-500 flex items-center gap-1 ml-5">
                    <ShieldCheck className="w-4 h-4 text-gray-400" /> Warranty: No warranty provided
                </span>
                {shippingTime && (
                    <span className="text-[11px] text-gray-400 ml-5">
                        Est. Delivery: {shippingTime} days
                    </span>
                )}
            </div>

            {/* Buy Buttons */}
            <div className="space-y-3">
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-full transition-all shadow-lg active:scale-95"
                >
                    Add to Cart
                </button>
                
                <button
                    onClick={() => {
                        handleAddToCart();
                        window.location.href = '/checkout';
                    }}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-full transition-all shadow-md active:scale-95"
                >
                    Buy Now
                </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure Payment</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">Encrypted</span>
                </div>
                <div className="flex justify-between">
                    <span>Ships from</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">{countryCode === 'US' ? 'USA' : 'Global Hub (CN)'}</span>
                </div>
            </div>
        </div>
    );
}
