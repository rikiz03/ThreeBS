export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-gray-600 mb-8 italic">Last Updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    We collect information you provide directly to us when you create an account, make a purchase,
                    sign up for our newsletter, or contact support. This may include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Name, email address, and phone number.</li>
                    <li>Shipping and billing addresses.</li>
                    <li>Payment information (processed securely via our payment gateways).</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Process and fulfill your orders.</li>
                    <li>Communicate with you about your orders and promotional offers.</li>
                    <li>Improve our website and customer service.</li>
                    <li>Detect and prevent fraudulent transactions.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
                <p className="text-gray-700 leading-relaxed">
                    We do not sell your personal information. We share your data only with third-party service providers
                    necessary to operate our business (e.g., shipping carriers, payment processors, and our backend providers).
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
                <p className="text-gray-700 leading-relaxed">
                    You have the right to access, correct, or delete your personal information.
                    Please contact us at support@threebrothersstores.com to exercise these rights.
                </p>
            </section>
        </div>
    );
}
