import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    // Redirect authenticated users away from login/register
    if (sessionCookie && ["/login", "/register"].includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect unauthenticated users or non-admins from admin routes
    if (pathname.startsWith("/admin")) {
        if (!sessionCookie) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Redirect unauthenticated users from protected routes to login
    if (!sessionCookie && (pathname.startsWith("/dashboard") || pathname.startsWith("/order"))) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/order", "/login", "/register", "/admin/:path*"],
};
