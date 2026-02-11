
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, departments } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { username, password, name, departmentId } = await request.json();

        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.username, username)).get();
        if (existingUser) {
            return NextResponse.json({ error: "Student already registered" }, { status: 400 });
        }

        // Resolve department Name to ID if needed
        // Assuming the frontend sends the Name string in 'departmentId' field because I set values that way.
        // Let's find the department by name.
        let targetDeptId = null;
        if (departmentId) {
            const dept = await db.select().from(departments).where(eq(departments.name, departmentId)).get();
            if (dept) {
                targetDeptId = dept.id;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await db.insert(users).values({
            username, // Roll Number
            password: hashedPassword,
            name,
            role: "STUDENT",
            departmentId: targetDeptId,
        }).returning({ id: users.id, username: users.username, role: users.role, departmentId: users.departmentId }).get();

        // Auto login
        const token = await signToken({
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
            departmentId: newUser.departmentId
        });

        (await cookies()).set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}
