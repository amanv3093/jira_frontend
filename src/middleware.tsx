// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const publicRoutes = ["/sign-in", "/sign-up", "/reset-password"];

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public/).*)"],
// };

// export async function middleware(request: NextRequest) {
//   // middleware
// const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

//   const { pathname } = request.nextUrl;

//   const isPublicRoute = publicRoutes.includes(pathname);

//   if (token && isPublicRoute) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   if (!token && !isPublicRoute) {
//     const signInUrl = new URL("/sign-in", request.url);
//     signInUrl.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(signInUrl);
//   }

//   return NextResponse.next();
// }
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = ["/sign-in", "/sign-up", "/reset-password", "/join"];

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public/).*)"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.includes(pathname);


  if (pathname.startsWith("/join/")) {
    
    if (token) return NextResponse.next();

    const tokenFromUrl = pathname.split("/join/")[1];
    const redirectUrl = new URL("/sign-in", request.url);

    redirectUrl.searchParams.set("token", tokenFromUrl);
    redirectUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  // 2️⃣ Logged-in users cannot access sign-in / sign-up
  if (token && ["/sign-in", "/sign-up"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3️⃣ All other private routes
  if (!token && !isPublicRoute) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}
