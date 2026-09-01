import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getProducts, getCategory } from '@/lib/data';
import { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategory(slug);

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    return {
        title: `Shop Premium ${category.name} | Premium Value Market`,
        description: `Explore our collection of high-quality ${category.name}. Best prices and global shipping on all products at Premium Value Market.`,
        alternates: {
            canonical: `https://premiumvaluemarket.com/category/${slug}`,
        },
        openGraph: {
            title: category.name,
            description: `Quality ${category.name} at Premium Value Market.`,
            url: `https://premiumvaluemarket.com/category/${slug}`,
            siteName: 'Premium Value Market',
            images: [
                {
                    url: category.image || '/mylogo1.png',
                    width: 800,
                    height: 800,
                    alt: category.name,
                },
            ],
            type: 'website',
        },
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = await getCategory(slug);

    if (!category) {
        notFound();
    }

    const products = await getProducts({ category: category.id, per_page: 100 });

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs items={[{ label: category.name, href: `/category/${slug}` }]} />
            <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0E5B3D] via-[#0A4630] to-black p-6 md:p-12 text-white shadow-xl border border-white/5">
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight drop-shadow-md">
                        {category.name.replace(/&amp;/g, '&').replace(/&#038;/g, '&')}
                    </h1>
                    <div className="flex items-center gap-2 text-[#74D644]/80">
                        <span className="w-6 h-0.5 bg-[#74D644] shadow-[0_0_8px_rgba(116,214,68,0.5)]"></span>
                        <p className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em]">
                            {products.length} {products.length === 1 ? 'Premium Item' : 'Premium Items'} Discovered
                        </p>
                    </div>
                </div>
                {/* Subtle light effect for consistency with brand green */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#74D644]/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#0E5B3D]/40 rounded-full blur-3xl"></div>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                    <h2 className="text-xl font-medium text-gray-600 mb-2">No products found in this category</h2>
                    <p className="text-gray-400">Try checking back later for new arrivals.</p>
                </div>
            )}
        </div>
    );
}
