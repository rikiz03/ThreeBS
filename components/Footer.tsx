'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Youtube, Mail, ShieldCheck, Lock, CreditCard, MapPin, Phone } from 'lucide-react';
import NewsletterSignup from './NewsletterSignup';
import LogoIcon from './LogoIcon';

export default function Footer() {
    return (
        <footer className="bg-[#0E5B3D] text-gray-200 pt-0 pb-8 border-t border-[#74D644]/20">
            <NewsletterSignup />
            <div className="container mx-auto px-4 mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group inline-flex">
                            <LogoIcon size={48} strokeColor="#74D644" fillColor="#0E5B3D" className="group-hover:scale-105 transition-transform" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tight leading-none text-white group-hover:text-[#74D644] transition-colors">
                                    Three Brothers Stores
                                </span>
                            </div>
                        </Link>
                        <p className="text-gray-300 text-sm leading-relaxed font-medium">
                            Your trusted global shopping destination. We source premium products from top suppliers worldwide and deliver directly to customers in the US, Europe, and beyond.
                        </p>
                        <div className="flex gap-3 pt-2">
                            {/* Instagram */}
                            <Link 
                                href="https://www.instagram.com/three_brothers_stores?igsh=anRwa2FqMWNqem5h" 
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow us on Instagram" 
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#74D644] hover:text-[#0E5B3D] text-white transition-all hover:scale-110 focus:outline-none"
                            >
                                <Instagram className="w-5 h-5" />
                            </Link>

                            {/* X (Twitter) */}
                            <Link 
                                href="#" 
                                aria-label="Follow us on X" 
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#74D644] hover:text-[#0E5B3D] text-white transition-all hover:scale-110 focus:outline-none"
                            >
                                <Twitter className="w-5 h-5" />
                            </Link>

                            {/* YouTube */}
                            <Link 
                                href="https://youtube.com/@three_brothers_tech?si=hLrGqNZPymHO7XmE" 
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow us on YouTube" 
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#74D644] hover:text-[#0E5B3D] text-white transition-all hover:scale-110 focus:outline-none"
                            >
                                <Youtube className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Departments */}
                    <div>
                        <h4 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Shop By Category</h4>
                        <ul className="space-y-4 font-medium">
                            {['Electronics & Gadgets', 'Fashion & Apparel', 'Home & Garden', 'Beauty & Health', 'Sports & Outdoors', 'Toys & Hobbies'].map((dept) => (
                                <li key={dept}>
                                    <Link href="/category/deals" className="hover:text-[#74D644] transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#74D644] opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all"></span>
                                        {dept}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Customer Care</h4>
                        <ul className="space-y-4 font-medium">
                            <li key="account">
                                <Link href="/account" className="hover:text-[#74D644] transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#74D644] opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all"></span>
                                    My Account
                                </Link>
                            </li>
                            <li key="about">
                                <Link href="/about-us" className="hover:text-[#74D644] transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#74D644] opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all"></span>
                                    About Three Brothers
                                </Link>
                            </li>
                            <li key="refunds">
                                <Link href="/refund-policy" className="hover:text-[#74D644] transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#74D644] opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all"></span>
                                    Returns & Refund Policy
                                </Link>
                            </li>
                            <li key="shipping">
                                <Link href="/shipping-info" className="hover:text-[#74D644] transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#74D644] opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all"></span>
                                    Delivery Information
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Contact Us</h4>
                        <p className="text-gray-300 text-sm mb-6 leading-relaxed font-medium">
                            Questions about your order? Our global support team is available 24/7.
                        </p>
                        <ul className="space-y-4 font-medium">
                            <li className="flex items-start gap-3 text-gray-300">
                                <MapPin className="w-5 h-5 text-[#74D644] mt-0.5" />
                                <span>Worldwide Shipping<br/>US & Europe Priority</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Phone className="w-5 h-5 text-[#74D644]" />
                                <span>1-800-3-BROTHERS</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Mail className="w-5 h-5 text-[#74D644]" />
                                <span className="text-white hover:text-[#74D644] transition-colors cursor-pointer">support@threebrotherstores.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="border-y border-white/10 py-6 text-center text-gray-300 bg-white/5 rounded-2xl mb-8">
                    <div className="flex flex-wrap justify-center items-center gap-8 px-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#74D644]/20 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-[#74D644]" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider">100% Secure Checkout</span>
                        </div>
                        <div className="hidden sm:block w-px h-8 bg-white/20"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#74D644]/20 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-[#74D644]" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider">Data Protection</span>
                        </div>
                        <div className="hidden sm:block w-px h-8 bg-white/20"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#74D644]/20 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-[#74D644]" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider">Safe Payments</span>
                        </div>
                    </div>
                </div>

                <div className="text-center text-xs text-gray-400 font-bold tracking-widest uppercase">
                    <p>&copy; {new Date().getFullYear()} Three Brothers Stores. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
