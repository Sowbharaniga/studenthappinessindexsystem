
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    // Public paths
    // Public paths
    const isLoginPage = pathname === "/login" || pathname === "/admin/login";

    if (isLoginPage) {
        // Allow access to login pages even if logged in, as requested.
        // The individual login pages can handle cleanup/logout if needed.
        return NextResponse.next();
    }

    // Protected paths
    if (pathname.startsWith("/admin") || pathname.startsWith("/student")) {
        // 1. Check if token exists
        if (!token) {
            if (pathname.startsWith("/admin")) {
                return NextResponse.redirect(new URL("/admin/login", request.url));
            } else {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }

        // 2. Verify token
        const payload = await verifyToken(token);
        if (!payload) {
            if (pathname.startsWith("/admin")) {
                return NextResponse.redirect(new URL("/admin/login", request.url));
            } else {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }

        const role = payload.role as string;

        // 3. Strict Role-based Access Control

        // Admin Pages Logic
        if (pathname.startsWith("/admin")) {
            if (role === "ADMIN") {
                return NextResponse.next(); // Allow access
            } else if (role === "STUDENT") {
                return NextResponse.redirect(new URL("/student/dashboard", request.url)); // Redirect to correct dashboard
            } else {
                // Unknown role or unauthorized
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }

        // Student Pages Logic
        if (pathname.startsWith("/student")) {
            if (role === "STUDENT") {
                return NextResponse.next(); // Allow access
            } else if (role === "ADMIN") {
                return NextResponse.redirect(new URL("/admin/dashboard", request.url)); // Redirect to correct dashboard
            } else {
                // Unknown role or unauthorized
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
