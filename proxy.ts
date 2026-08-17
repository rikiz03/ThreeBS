import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/product/(.*)',
  '/category/(.*)',
  '/blog(.*)',
  '/search',
  '/about-us',
  '/contact-us',
  '/privacy-policy',
  '/refund-policy',
  '/shipping-info',
  '/terms-conditions',
  '/track-order',
  '/api/shipping/(.*)',
  '/api/fulfillment/(.*)',
  '/api/cart/(.*)',
  '/api/translate',
]);

const HOST_REDIRECT_FROM = 'threebrotherstores.com';
const HOST_REDIRECT_TO = 'www.threebrotherstores.com';

function redirectToWwwIfNeeded(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase();

  if (host !== HOST_REDIRECT_FROM) return;

  const url = new URL(request.url);
  url.host = HOST_REDIRECT_TO;
  url.protocol = 'https';
  return Response.redirect(url, 308);
}

export default clerkMiddleware(async (auth, request) => {
  // Keep the canonical-domain redirect ahead of route protection.
  const hostRedirect = redirectToWwwIfNeeded(request);
  if (hostRedirect) return hostRedirect;

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes.
    '/(api|trpc)(.*)',
  ],
};
