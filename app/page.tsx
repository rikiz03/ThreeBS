import HeroBanner from "@/components/HeroBanner";
import CategoryList from "@/components/CategoryList";
import ProductCard from "@/components/ProductCard";
import PromoBanners from "@/components/PromoBanners";
import TrendingSection from "@/components/TrendingSection";
import { getProducts, getCategories } from "@/lib/data";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Product } from "@/lib/types";

export const revalidate = 60; 

// Reusable product section with a header, "See more" link, and a product grid.
function ProductSection({ title, subtitle, link, products }: { title: string; subtitle: string; link: string; products: Product[] }) {
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h2 className="text-2xl font-black text-[#0E5B3D] tracking-tight">{title}</h2>
          <p className="text-xs text-gray-500 font-bold mt-0.5">{subtitle}</p>
        </div>
        <Link href={link} className="text-xs font-black text-[#0E5B3D] hover:text-[#74D644] transition-colors flex items-center gap-1 uppercase tracking-wider">
          See more <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm border border-gray-100">
          New arrivals in {title} are on their way. Check back soon!
        </div>
      )}
    </div>
  );
}

export default async function Home() {
  const [
    categories,
    fitnessProducts,
    homeProducts,
    beautyProducts,
    creatorProducts,
    autoProducts,
    outdoorProducts,
    lightingProducts,
    officeProducts,
    gamingProducts
  ] = await Promise.all([
    getCategories({ per_page: 20 }),
    getProducts({ category: 'cat-gym', per_page: 50 }),
    getProducts({ category: 'cat-home', per_page: 50 }),
    getProducts({ category: 'cat-wellness', per_page: 50 }),
    getProducts({ category: 'cat-creator', per_page: 50 }),
    getProducts({ category: 'cat-auto', per_page: 50 }),
    getProducts({ category: 'cat-outdoor', per_page: 50 }),
    getProducts({ category: 'cat-light', per_page: 50 }),
    getProducts({ category: 'cat-office', per_page: 50 }),
    getProducts({ category: 'cat-gaming', per_page: 50 })
  ]);

  // "Trending Products" is click-driven and only appears once a real Top 10 of
  // frequently-clicked products emerges on the platform (see <TrendingSection>).
  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-16">
      <div className="container mx-auto px-4">
        {/* 1. Hero Banner Section */}
        <HeroBanner />

        {/* 2. Categories Bar Section */}
        <CategoryList categories={categories} />

        {/* 3. Trending Products Section (Top-10 most frequently clicked) */}
        <TrendingSection />

{/* 4. Fitness & Gym Section */}
        <ProductSection
          title="Fitness & Home Gym"
          subtitle="Gear to power your workouts"
          link="/category/fitness-gym"
          products={fitnessProducts}
        />

        {/* 5. Home & Lifestyle Section */}
        <ProductSection
          title="Home & Lifestyle"
          subtitle="Upgrade your living space"
          link="/category/home-lifestyle"
          products={homeProducts}
        />

        {/* 6. Health & Beauty Section */}
        <ProductSection
          title="Health & Beauty"
          subtitle="Wellness essentials for everyday"
          link="/category/health-wellness"
          products={beautyProducts}
        />

        {/* 7. Creator Studio Section */}
        <ProductSection
          title="Creator Studio"
          subtitle="Gear for content creators"
          link="/category/creator-studio"
          products={creatorProducts}
        />

        {/* 8. Automotive Section */}
        <ProductSection
          title="Automotive"
          subtitle="Style, care & accessories for your ride"
          link="/category/automotive"
          products={autoProducts}
        />

        {/* 9. Outdoor & Adventure Section */}
        <ProductSection
          title="Outdoor & Adventure"
          subtitle="Explore the great outdoors"
          link="/category/outdoor-adventure"
          products={outdoorProducts}
        />

        {/* 10. Promotional Banners, Best Selling Items, & App Download Banner */}
        <PromoBanners
          lightingProducts={lightingProducts}
          officeProducts={officeProducts}
          gamingProducts={gamingProducts}
        />
      </div>
    </div>
  );
}
