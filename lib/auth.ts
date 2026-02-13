
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-key-change-this");

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (err) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies(); // In Next 15+ cookies() is async, ensure we handle if project is 14 or latest
    const token = cookieStore.get("session")?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}
