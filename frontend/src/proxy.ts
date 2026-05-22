import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Next.js 16 renamed `middleware` → `proxy`. Clerk's middleware returns a
// standard Next middleware function, which we default-export here.
//
// Note: the `/admin` panel uses its own backend username/password auth, so it
// is intentionally NOT protected by Clerk.
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/checkout(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run on everything except Next internals and static assets…
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ico|webp|woff2?|ttf|map)).*)",
    // …and always run on API/trpc routes.
    "/(api|trpc)(.*)",
  ],
};
