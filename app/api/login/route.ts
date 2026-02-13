
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
        }

        // Check if user exists
        const user = (await db.select().from(users).where(eq(users.username, username)))[0];

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Create session
        const token = await signToken({
            id: user.id,
            username: user.username,
            role: user.role,
            departmentId: user.departmentId
        });

        (await cookies()).set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        // Return role for redirect
        return NextResponse.json({
            success: true,
            role: user.role,
            token // Returning token as well for API clients
        });

    } catch (e) {
        console.error("Login error:", e);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
