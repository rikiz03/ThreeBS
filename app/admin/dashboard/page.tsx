'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Percent, ArrowUpRight } from 'lucide-react';
import { isAdmin } from '@/lib/owner';

export default function AdminDashboard() {
    const { user, isLoaded } = useUser();
    const [statsData, setStatsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                setStatsData(data);
            } catch (err) {
                console.error('Stats fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const userEmail = user?.emailAddresses[0]?.emailAddress;

    // Wait for Clerk to load
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user || !isAdmin({ emailAddress: userEmail, id: user.id })) {
        if (typeof window !== 'undefined') window.location.href = '/';
        return null;
    }

    const cards = [
        { label: 'Total Revenue', value: statsData ? `$${statsData.revenue}` : '...', icon: DollarSign, trend: '+12.5%', color: 'bg-blue-500' },
        { label: 'Precise Net Profit', value: statsData ? `$${statsData.profit}` : '...', icon: TrendingUp, trend: '+8.2%', color: 'bg-green-500' },
        { label: 'Total Orders', value: statsData ? statsData.orders : '...', icon: ShoppingCart, trend: '+15.3%', color: 'bg-purple-500' },
        { label: 'Success Rate', value: statsData ? statsData.rate : '...', icon: Percent, trend: '+2.1%', color: 'bg-orange-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 pt-32 pb-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Business Intelligence</h1>
                            <p className="text-gray-500">Welcome back, {user.firstName}. Real-time performance overview.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-green-100">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Live Store Status: Active
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="container mx-auto px-4 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((stat) => (
                        <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${stat.color} p-3 rounded-xl text-white`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                            <div className="text-2xl font-black text-gray-900">
                                {loading ? (
                                    <div className="h-8 w-24 bg-gray-100 animate-pulse rounded" />
                                ) : (
                                    stat.value
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                    {/* Recent Scaling Actions */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-gray-900">Revenue Performance</h2>
                            <button className="text-sm text-blue-600 font-bold hover:underline">View All Sales</button>
                        </div>
                        
                        <div className="h-64 flex items-end gap-2 px-2">
                            {/* Placeholder for real Charts logic */}
                            {[40, 60, 30, 80, 50, 90, 70, 85, 45, 95, 60, 75].map((height, i) => (
                                <div 
                                    key={i} 
                                    className="flex-1 bg-blue-50 rounded-t-lg hover:bg-blue-500 transition-all relative group cursor-pointer"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Day {i + 1}: ${height * 10}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 px-2 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                            <span>April 01</span>
                            <span>April 30</span>
                        </div>
                    </div>

                    {/* Sales Breakdown by Supplier */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-8">Supplier Efficiency</h2>
                        <div className="space-y-6">
                            {[
                                { name: 'CJ Dropshipping', share: '65%', color: 'bg-orange-500' },
                                { name: 'DSers (AliExpress)', share: '25%', color: 'bg-red-500' },
                                { name: 'EPROLO', share: '10%', color: 'bg-blue-500' },
                            ].map((sup) => (
                                <div key={sup.name}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-gray-700">{sup.name}</span>
                                        <span className="text-gray-500">{sup.share}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div className={`${sup.color} h-full`} style={{ width: sup.share }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-12 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h4 className="font-bold text-gray-900 text-sm mb-2">💡 Quick Insight</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                CJ Dropshipping is currently providing the best profit margins (38%). Consider moving more inventory focus there.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
