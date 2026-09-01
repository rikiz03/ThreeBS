import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './types';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    shippingFee: number;
    currentShippingFee: number;
    currentExtraShipping: number;
    currentBasePrice: number;
    currentProductImage: string;
    currentShippingTime: string;
    addItem: (product: any) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    setShippingFee: (fee: number) => void;
    setCurrentShippingFee: (fee: number) => void;
    setCurrentExtraShipping: (fee: number) => void;
    setCurrentBasePrice: (price: number) => void;
    setCurrentProductImage: (image: string) => void;
    setCurrentShippingTime: (time: string) => void;
    clearCart: () => void;
    checkoutDetails: { email: string, fullName: string, city: string, orderId: string, gateway: string } | null;
    setCheckoutDetails: (details: { email: string, fullName: string, city: string, orderId: string, gateway: string } | null) => void;
    total: () => number;
    subtotal: () => number;
    getDiscountInfo: () => { amount: number; percentage: number };
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            shippingFee: 0,
            currentShippingFee: 0,
            currentExtraShipping: 0,
            currentBasePrice: 0,
            currentProductImage: '',
            currentShippingTime: '',
            checkoutDetails: null,
            setCurrentShippingFee: (currentShippingFee) => set({ currentShippingFee }),
            setCurrentExtraShipping: (currentExtraShipping) => set({ currentExtraShipping }),
            setCurrentBasePrice: (currentBasePrice) => set({ currentBasePrice }),
            setCurrentProductImage: (currentProductImage) => set({ currentProductImage }),
            setCurrentShippingTime: (currentShippingTime) => set({ currentShippingTime }),
            setCheckoutDetails: (checkoutDetails) => set({ checkoutDetails }),
            addItem: (product) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, { ...product, quantity: 1 }] });
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((item) => item.id !== productId) });
            },
            updateQuantity: (productId, quantity) => {
                if (quantity < 1) return;
                set({
                    items: get().items.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                });
            },
            setShippingFee: (shippingFee) => set({ shippingFee }),
            clearCart: () => set({ items: [], shippingFee: 0, checkoutDetails: null }),
            
            getDiscountInfo: () => {
                const items = get().items;
                if (items.length === 0) return { amount: 0, percentage: 0 };

                // Group items by base product ID (e.g. "102-1" -> "102")
                const productGroups: Record<string, number> = {};
                items.forEach(item => {
                    const baseId = item.id.split('-')[0];
                    productGroups[baseId] = (productGroups[baseId] || 0) + item.quantity;
                });

                let totalDiscount = 0;
                let maxPercentage = 0;

                items.forEach(item => {
                    const baseId = item.id.split('-')[0];
                    const groupQty = productGroups[baseId];
                    
                    let discountRate = 0;
                    if (groupQty >= 3) {
                        discountRate = 0.10; // 10% for 3+ items
                    } else if (groupQty === 2) {
                        discountRate = 0.05; // 5% for 2 items
                    }

                    if (discountRate > 0) {
                        totalDiscount += (item.price * item.quantity) * discountRate;
                        maxPercentage = Math.max(maxPercentage, discountRate * 100);
                    }
                });

                return { amount: totalDiscount, percentage: maxPercentage };
            },

            total: () => {
                const subtotal = get().subtotal();
                const discount = get().getDiscountInfo().amount;
                return subtotal - discount;
            },
            subtotal: () => {
                return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);

import { detectUserLocation } from './geo';

interface SettingsState {
    locale: string;
    currency: string;
    countryCode: string;
    setLocale: (locale: string) => void;
    setCurrency: (currency: string) => void;
    setCountryCode: (countryCode: string) => void;
    initializeSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            locale: 'en',
            currency: 'USD',
            countryCode: 'US',
            setLocale: (locale) => set({ locale }),
            setCurrency: (currency) => set({ currency }),
            setCountryCode: (countryCode) => set({ countryCode }),
            initializeSettings: async () => {
                try {
                    const info = await detectUserLocation();
                    set({
                        locale: info.locale,
                        currency: info.currency,
                        countryCode: info.countryCode
                    });
                } catch (error) {
                    console.error('Failed to initialize settings:', error);
                }
            },
        }),
        {
            name: 'settings-storage',
        }
    )
);

interface SalesEntry {
    qty: number;
    product: CartItem;
}

interface SalesState {
    sales: Record<string, SalesEntry>;
    recordPurchase: (items: CartItem[]) => void;
    clearSales: () => void;
}

/**
 * Tracks total units sold per product so the "Best selling items" section
 * only appears once real purchases have been made on the platform.
 */
export const useSalesStore = create<SalesState>()(
    persist(
        (set, get) => ({
            sales: {},
            recordPurchase: (items) => {
                if (!items || items.length === 0) return;
                const sales = { ...get().sales };
                items.forEach(item => {
                    const existing = sales[item.id];
                    sales[item.id] = {
                        qty: (existing?.qty || 0) + item.quantity,
                        product: item,
                    };
                });
                set({ sales });
            },
            clearSales: () => set({ sales: {} }),
        }),
        {
            name: 'sales-storage',
        }
    )
);
