
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    // Public paths
    if (pathname === "/login") {
        if (token) {
            // If already logged in, redirect to dashboard based on role (optimistic check)
            // We can't verify role easily without decoding, but we'll let them go to their
            // likely dashboard or just dashboard. For now, just let login page handle redirect if visited.
            return NextResponse.next();
        }
        return NextResponse.next();
    }

    // Protected paths
    if (pathname.startsWith("/admin") || pathname.startsWith("/student")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const role = payload.role as string;

        // Role-based protection
        if (pathname.startsWith("/admin") && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/student/dashboard", request.url));
        }

        if (pathname.startsWith("/student") && role !== "STUDENT") {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
