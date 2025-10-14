import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = ["/sign-in", "/sign-up", "/reset-password","/"];

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public/).*)"],
};

export async function middleware(request: NextRequest) {
  // middleware
const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.includes(pathname);

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  if (!token && !isPublicRoute) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}
