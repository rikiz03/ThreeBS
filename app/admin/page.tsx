'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Store, Mail, User as UserIcon, ShieldCheck, ArrowRight, LayoutDashboard } from 'lucide-react';
import { OWNER, isAdmin } from '@/lib/owner';

export default function AdminPage() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-[#0E5B3D] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const userEmail = user?.emailAddresses?.[0]?.emailAddress ?? '';

    // Only the project owner is allowed in. Redirect everyone else to home.
    if (!user || !isAdmin({ emailAddress: userEmail, id: user.id })) {
        if (typeof window !== 'undefined') window.location.href = '/';
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-[#0E5B3D] pt-32 pb-16 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                                <ShieldCheck className="w-4 h-4 text-[#74D644]" />
                                Owner Admin Portal
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Hi {user.firstName || 'there'}, welcome to your admin page</h1>
                            <p className="text-[#74D644] font-semibold mt-1">Manage your business &amp; store in one place.</p>
                        </div>
                        <Link
                            href="/admin/dashboard"
                            className="inline-flex items-center gap-2 bg-white text-[#0E5B3D] font-bold px-5 py-3 rounded-xl shadow-lg hover:bg-lime-100 transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Business Intelligence
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Business identity card */}
            <div className="container mx-auto px-4 -mt-10">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden max-w-3xl mx-auto">
                    <div className="bg-gradient-to-r from-[#0E5B3D] to-[#0E5B3D]/90 px-8 py-6 flex items-center justify-between">
                        <div>
                            <p className="text-[#74D644] text-xs font-bold uppercase tracking-widest">Business Profile</p>
                            <h2 className="text-2xl font-black text-white mt-1">{OWNER.businessName}</h2>
                        </div>
                        <div className="bg-white/20 rounded-full p-3">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-emerald-50 rounded-xl p-3">
                                <Store className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Business Name</p>
                                <p className="text-lg font-black text-gray-900">{OWNER.businessName}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-sky-50 rounded-xl p-3">
                                <Mail className="w-5 h-5 text-sky-600" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Business Email</p>
                                <a href={`mailto:${OWNER.businessEmail}`} className="text-lg font-bold text-[#0E5B3D] hover:underline">
                                    {OWNER.businessEmail}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-violet-50 rounded-xl p-3">
                                <UserIcon className="w-5 h-5 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Owner Name</p>
                                <p className="text-lg font-black text-gray-900">{OWNER.ownerName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pb-8">
                        <Link
                            href="/admin/dashboard"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0E5B3D] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0A4A31] transition-colors"
                        >
                            Go to Business Intelligence
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}