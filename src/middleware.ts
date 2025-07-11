import { auth } from '@/src/auth';

// 🔐 Các route cần đăng nhập
const protectedRoutes = [
  '/booking',
  '/checkout',
  '/profile',
  '/confirmation',
];

// 🆓 Các route công khai
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/auth',
  '/2fa',
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  // ✅ Bỏ qua route công khai và tài nguyên tĩnh
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  const isStaticAsset =
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/public');

  if (isPublicRoute || isStaticAsset) {
    console.log('✅ Public route or static asset, allowing access');
    return;
  }

  // 🔒 Kiểm tra route cần đăng nhập
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route)
  );

  if (isProtectedRoute && !req.auth) {
    const url = new URL('/login', req.url);
    // Lưu URL hiện tại để redirect sau khi đăng nhập
    url.searchParams.set('callbackUrl', req.url);
    return Response.redirect(url);
  }

  console.log('✅ Allowing access to:', pathname);
});

// ⚙️ Matcher: chạy middleware cho tất cả trừ file tĩnh
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|public).*)',
  ],
};
