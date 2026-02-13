
import { NextResponse } from "next/server";
import { db } from "@/db";
import { questions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { text, category, status } = body;

        if (!text || !category || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedQuestion = await db.update(questions)
            .set({ text, category, status })
            .where(eq(questions.id, id))
            .returning()
            .then(res => res[0]);



        return NextResponse.json(updatedQuestion);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await db.delete(questions).where(eq(questions.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
    }
}
