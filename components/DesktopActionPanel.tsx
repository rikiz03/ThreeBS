'use client';

import { useCartStore, useSettingsStore } from '@/lib/store';
import { Truck, ShieldCheck, Lock, ShoppingCart, Zap } from 'lucide-react';
import { Product } from '@/lib/types';

interface DesktopActionPanelProps {
    product: Product;
}

export default function DesktopActionPanel({ product }: DesktopActionPanelProps) {
    const { 
        addItem, 
        currentBasePrice, 
        currentExtraShipping, 
        currentShippingTime,
        currentProductImage 
    } = useCartStore();
    const { countryCode } = useSettingsStore();

    const handleAddToCart = () => {
        // We use the ID logic from the store to find if it's a variant
        // But since we are duplicating the 'Add to Cart' from the BuyBox,
        // the store already knows the current state from the BuyBox's broadcasters.
        
        // Note: We need the ID to be unique. In a real app, we'd sync the 'selectedVariantId' too.
        // For now, we'll trigger the same logic as the BuyBox.
        addItem({
            id: product.id, // Simplification for the secondary button
            title: product.title,
            price: currentBasePrice || product.price,
            image: currentProductImage || product.image,
            quantity: 1,
            supplier: product.supplier,
            externalId: product.externalId
        });
        alert('Added to Cart!');
    };

    return (
        <div className="hidden md:block mt-6 p-6 border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30">
            <div className="grid grid-cols-1 gap-6">
                
                {/* Shipping & Warranty Info Row */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-6">
                    <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-[#0E5B3D]" />
                        <div>
                            <span className="block font-bold text-[#0E5B3D] dark:text-[#74D644]">Worldwide Shipping</span>
                            <span className="text-[10px] opacity-70">Shipping included in price</span>
                        </div>
                    </div>
                    {currentShippingTime && (
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-[#74D644]" />
                            <div>
                                <span className="block font-bold">Est. Delivery</span>
                                <span className="text-[10px] opacity-70">{currentShippingTime} days</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Primary Action Row - Brand colors */}
                <div className="flex gap-4">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#0E5B3D] hover:bg-[#0a4a33] text-white font-black py-4 rounded-full hover:scale-[1.02] transition-all active:scale-95 shadow-lg uppercase tracking-wide"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                    </button>
                    <button
                        onClick={() => {
                            handleAddToCart();
                            window.location.href = '/checkout';
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#74D644] hover:bg-lime-400 text-[#0E5B3D] font-black py-4 rounded-full hover:scale-[1.02] transition-all active:scale-95 shadow-md uppercase tracking-wide"
                    >
                        Buy Now
                    </button>
                </div>

                {/* Trust Footer */}
                <div className="flex justify-between items-center text-[11px] text-gray-400 pt-2 uppercase tracking-widest font-bold">
                    <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Secure Payment</span>
                        <span className="text-[#0E5B3D] ml-1">● Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span>Ships from:</span>
                        <span className="text-gray-900 dark:text-gray-100">{countryCode === 'US' ? 'USA' : 'Global Hub (CN)'}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
