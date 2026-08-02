import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import TrackingProvider from "@/components/TrackingProvider";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import SocialProof from "@/components/SocialProof";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://threebrothersstores.com"),
  title: {
    default: "Three Brothers' Stores | Premium Global Shopping & Unbeatable Deals",
    template: "%s | Three Brothers' Stores"
  },
  description: "Find high-quality products sourced directly from global dropshipping networks at Three Brothers' Stores. Sourced from CJ Dropshipping, DSers, and Eprolo, we ship premium fashion, electronics, home items, and more to the US, Europe, and worldwide.",
  keywords: ["online shopping", "e-commerce", "global shipping", "best deals", "CJ Dropshipping", "DSers", "Eprolo", "Three Brothers Stores"],
  authors: [{ name: "Three Brothers Stores Team" }],
  creator: "Three Brothers Stores",
  publisher: "Three Brothers Stores",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/TBS-image.jpg",
    shortcut: "/TBS-image.jpg",
    apple: "/TBS-image.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://threebrothersstores.com",
    siteName: "Three Brothers Stores",
    title: "Three Brothers' Stores | Global Shopping Destination",
    description: "Shop premium quality products sourced from top suppliers (CJ Dropshipping, DSers, Eprolo) at unbeatable prices with worldwide shipping.",
    images: [
      {
        url: "/mylogo1.png",
        width: 1200,
        height: 630,
        alt: "Three Brothers' Stores Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Three Brothers' Stores",
    description: "Your trusted global shopping destination for premium quality products at unbeatable prices.",
    images: ["/mylogo1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "orfY4EXNrRw3lTbMY8V1zWQq9iZBFNtwwubCMnKChH4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Three Brothers' Stores",
    url: 'https://threebrothersstores.com',
    logo: 'https://threebrothersstores.com/mylogo1.png',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@threebrotherstores.com',
      contactType: 'customer service',
      areaServed: 'Global',
      availableLanguage: 'English',
    },
    sameAs: [
      // Add your social media URLs here
    ],
  };

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <meta name="application-name" content="Three Brothers Stores" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Three Brothers Stores" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#000000" />
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body className={`font-sans bg-gray-50 min-h-screen flex flex-col`}>
          <Suspense fallback={null}>
            <TrackingProvider />
          </Suspense>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <SocialProof />
          <ExitIntentPopup />
          <Script id="tawk-to" strategy="afterInteractive">
            {`
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6a5bbffe1c52dc1d4c7edb33/1jtr6buqv';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `}
          </Script>
        </body>
      </html>
    </ClerkProvider>
  );
}
