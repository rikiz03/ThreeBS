import { MetadataRoute } from 'next'
import { getProducts, getCategories } from '@/lib/data'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_URL

    // Fetch all products and categories for dynamic indexing
    const [products, categories] = await Promise.all([
        getProducts({ per_page: 100 }), // Adjust limit as needed
        getCategories({ per_page: 50 })
    ])

    const mainRoutes = [
        '',
        '/refund-policy',
        '/shipping-info',
        '/privacy-policy',
        '/terms-conditions',
        '/about-us',
        '/contact-us',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    const categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    const productRoutes = products.map((prod) => ({
        url: `${baseUrl}/product/${prod.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    return [...mainRoutes, ...categoryRoutes, ...productRoutes]
}
