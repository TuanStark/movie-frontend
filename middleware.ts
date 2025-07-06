import { auth } from "@/src/auth";

export default auth((req) => {
  // req.auth contains the session information
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Define protected routes
  const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') ||
                          nextUrl.pathname.startsWith('/profile') ||
                          nextUrl.pathname.startsWith('/booking');

  // Define auth routes
  const isAuthRoute = nextUrl.pathname.startsWith('/auth/login') ||
                     nextUrl.pathname.startsWith('/auth/register');

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL('/', nextUrl));
  }

  // Redirect non-logged-in users to login for protected routes
  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL('/auth/login', nextUrl));
  }

  return;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
