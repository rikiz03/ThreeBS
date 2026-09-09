'use client';

import { Mail, Send, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { SUPPORT_EMAIL } from '@/lib/site';

export default function ContactUs() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    const openChat = () => {
        if (typeof window !== 'undefined' && (window as any).Tawk_API) {
            (window as any).Tawk_API.maximize();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Mock submission
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
            <p className="text-gray-500 text-center mb-12">Any questions or remarks? Just write us a message!</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
                {/* Left side: Info */}
                <div className="lg:col-span-5 bg-gray-900 p-10 text-white flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                        <p className="text-gray-400 mb-10">Fill up the form and our Team will get back to you within 24 hours.</p>

                        <ul className="space-y-8">
                            <li 
                                onClick={openChat}
                                className="flex items-start gap-4 hover:text-blue-400 transition-colors cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-sm mt-1">International Global Support (24/7 Online)</span>
                            </li>
                            <li 
                                onClick={openChat}
                                className="flex items-center gap-4 hover:text-blue-400 transition-colors cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <span className="font-medium">Live Chat Support Available</span>
                            </li>
                            <li className="flex items-center gap-4 hover:text-blue-400 transition-colors cursor-pointer">
                                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <span className="font-medium">{SUPPORT_EMAIL}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-4 mt-12">
                        <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 cursor-pointer transition-all"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 cursor-pointer transition-all"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 cursor-pointer transition-all"></div>
                    </div>
                </div>

                {/* Right side: Form */}
                <div className="lg:col-span-7 p-10">
                    {status === 'success' ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <Send className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                            <p className="text-gray-500">We've received your message and will get back to you shortly.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-8 text-blue-600 font-bold hover:underline"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input required type="text" className="w-full border-b-2 border-gray-100 focus:border-gray-900 outline-none py-2 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input required type="text" className="w-full border-b-2 border-gray-100 focus:border-gray-900 outline-none py-2 transition-all" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input required type="email" className="w-full border-b-2 border-gray-100 focus:border-gray-900 outline-none py-2 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Number (Optional)</label>
                                    <input type="text" className="w-full border-b-2 border-gray-100 focus:border-gray-900 outline-none py-2 transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Write your message..."
                                    className="w-full border-b-2 border-gray-100 focus:border-gray-900 outline-none py-2 transition-all resize-none"
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="bg-gray-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
                                >
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
