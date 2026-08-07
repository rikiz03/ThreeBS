export default function AboutUs() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">About Three Brothers' Stores</h1>

            <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-6 leading-relaxed">
                    Welcome to Three Brothers' Stores, a premium headless e-commerce destination built with Next.js and powered by WooCommerce. 
                    We are dedicated to providing a world-class online shopping experience for customers in the United States, Europe, and globally. 
                    By partnering directly with verified global dropshipping suppliers—specifically CJ Dropshipping, DSers, and Eprolo—we bypass the traditional retail markup 
                    and deliver high-quality, curated products directly from manufacturing partners to your doorstep.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800">Our Mission</h2>
                <p className="mb-6 leading-relaxed">
                    Our mission is to make global shopping fast, transparent, and completely worry-free. Through our advanced Next.js frontend, we integrate 
                    live geolocation checks that automatically detect your country and display product pricing in your local currency, ensuring complete pricing clarity from browse to checkout.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800">Technology & Infrastructure</h2>
                <p className="mb-6 leading-relaxed">
                    To deliver maximum security and near-zero load times, our store is hosted on high-performance Hostinger servers and integrated with Cloudflare's secure DNS and edge networks. 
                    This ensures that no matter where you are in the world, you experience blazing-fast loading speeds and industry-standard security.
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800">Why Shop With Us?</h2>
                <ul className="list-disc pl-6 space-y-4 mb-8">
                    <li>
                        <strong>Curated Global Sourcing:</strong> We source directly from top suppliers (CJ Dropshipping, DSers, and Eprolo) ensuring strict quality control and access to the latest trends.
                    </li>
                    <li>
                        <strong>Smart Multi-Currency:</strong> No math required. Our website automatically translates all product prices to your local currency.
                    </li>
                    <li>
                        <strong>Worldwide Shipping:</strong> While we target and optimize delivery lines for the US and Europe, we ship to customers all over the world.
                    </li>
<li>
                        <strong>24/7 Dedicated Support:</strong> Our support desk is always online. For any inquiries, reach us at <a href="mailto:support@threebrotherstores.com" className="text-[#0E5B3D] hover:underline font-bold">support@threebrotherstores.com</a>.
                    </li>
                </ul>

                <div className="bg-[#0E5B3D]/10 p-8 rounded-2xl mt-12 text-center">
                    <h3 className="text-xl font-bold text-[#0E5B3D] mb-2">Shop Globally, Feel Locally</h3>
                    <p className="text-[#0E5B3D] mb-6">
                        Explore our store and experience a custom, local-feel shopping experience backed by global fulfillment speeds.
                    </p>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest border-t border-gray-200 pt-6">
                        Three Brothers' Stores — Quality Sourced, Globally Delivered.
                    </p>
                </div>
            </div>
        </div>
    );
}
