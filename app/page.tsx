import HeroBanner from "@/components/HeroBanner";
import CategoryList from "@/components/CategoryList";
import ProductCard from "@/components/ProductCard";
import PromoBanners from "@/components/PromoBanners";
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
    products,
    categories,
    fitnessProducts,
    homeProducts,
    beautyProducts,
    creatorProducts,
    autoProducts,
    outdoorProducts
  ] = await Promise.all([
    getProducts({ per_page: 50, page: 1 }),
    getCategories({ per_page: 20 }),
    getProducts({ category: 'cat-gym', per_page: 50 }),
    getProducts({ category: 'cat-home', per_page: 50 }),
    getProducts({ category: 'cat-wellness', per_page: 50 }),
    getProducts({ category: 'cat-creator', per_page: 50 }),
    getProducts({ category: 'cat-auto', per_page: 50 }),
    getProducts({ category: 'cat-outdoor', per_page: 50 })
  ]);

  // Fallback mockup products if store is empty
  const mockupProducts: Product[] = [
    { id: 'mock-p1', title: 'Wireless Noise-Cancelling Headphones', price: 49.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop', rating: 5, reviews: 127, category: 'Electronics', allCategories: ['Electronics'], description: 'Premium wireless headphones with active noise cancellation', supplier: 'UNKNOWN', externalId: 'mock-p1' },
    { id: 'mock-p2', title: 'Smart Watch Pro', price: 79.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop', rating: 5, reviews: 89, category: 'Electronics', allCategories: ['Electronics'], description: 'Feature-packed smartwatch with health monitoring', supplier: 'UNKNOWN', externalId: 'mock-p2' },
    { id: 'mock-p3', title: 'Portable Bluetooth Speaker', price: 34.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=400&auto=format&fit=crop', rating: 4.5, reviews: 56, category: 'Electronics', allCategories: ['Electronics'], description: 'Compact waterproof Bluetooth speaker', supplier: 'UNKNOWN', externalId: 'mock-p3' },
    { id: 'mock-p4', title: 'Minimalist Leather Wallet', price: 24.99, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop', rating: 5, reviews: 203, category: 'Fashion', allCategories: ['Fashion'], description: 'Slim RFID-blocking leather wallet', supplier: 'UNKNOWN', externalId: 'mock-p4' },
    { id: 'mock-p5', title: 'LED Ring Light Kit', price: 29.99, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop', rating: 4.8, reviews: 145, category: 'Electronics', allCategories: ['Electronics'], description: 'Professional LED ring light with tripod stand', supplier: 'UNKNOWN', externalId: 'mock-p5' },
    { id: 'mock-p6', title: 'Yoga Mat Premium', price: 39.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=400&auto=format&fit=crop', rating: 5, reviews: 78, category: 'Sports', allCategories: ['Sports'], description: 'Non-slip premium yoga mat with carrying strap', supplier: 'UNKNOWN', externalId: 'mock-p6' },
    { id: 'mock-p7', title: 'Insulated Water Bottle', price: 19.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400&auto=format&fit=crop', rating: 4.9, reviews: 312, category: 'Sports', allCategories: ['Sports'], description: 'Double-wall insulated stainless steel bottle', supplier: 'UNKNOWN', externalId: 'mock-p7' },
    { id: 'mock-p8', title: 'Laptop Stand Adjustable', price: 27.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400&auto=format&fit=crop', rating: 4.2, reviews: 67, category: 'Home & Garden', allCategories: ['Home & Garden'], description: 'Ergonomic adjustable laptop riser stand', supplier: 'UNKNOWN', externalId: 'mock-p8' },
    { id: 'mock-p9', title: 'Sunglasses Polarized UV400', price: 15.99, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400&auto=format&fit=crop', rating: 5, reviews: 256, category: 'Fashion', allCategories: ['Fashion'], description: 'Classic polarized sunglasses with UV400 protection', supplier: 'UNKNOWN', externalId: 'mock-p9' },
    { id: 'mock-p10', title: 'Phone Holder Car Mount', price: 12.99, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400&auto=format&fit=crop', rating: 4.6, reviews: 189, category: 'Electronics', allCategories: ['Electronics'], description: 'Universal magnetic car phone mount holder', supplier: 'UNKNOWN', externalId: 'mock-p10' },
  ];

  const displayProducts = products?.length > 0 ? products : mockupProducts;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-16">
      <div className="container mx-auto px-4">
        {/* 1. Hero Banner Section */}
        <HeroBanner />

        {/* 2. Categories Bar Section */}
        <CategoryList categories={categories} />

        {/* 3. "You might need" Section (Product Grid from Mockup) */}
        <div className="mb-16" id="products-section">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 className="text-2xl font-black text-[#0E5B3D] tracking-tight">Trending Products</h2>
              <p className="text-xs text-gray-500 font-bold mt-0.5">Hot picks & best sellers worldwide</p>
            </div>
            <Link href="/category/deals" className="text-xs font-black text-[#0E5B3D] hover:text-[#74D644] transition-colors flex items-center gap-1 uppercase tracking-wider">
              See more <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {displayProducts.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

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

        {/* 10. Promotional Banners, Weekly Best Selling, & App Download Banner */}
        <PromoBanners />
      </div>
    </div>
  );
}
