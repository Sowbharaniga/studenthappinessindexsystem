
import { NextResponse } from "next/server";
import { db } from "@/db";
import { questions } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const allQuestions = await db.select().from(questions);
        return NextResponse.json(allQuestions);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { text, category } = body;

        if (!text || !category) {
            return NextResponse.json({ error: "Text and Category are required" }, { status: 400 });
        }

        // The .returning() and .then(res => res[0]) pattern is correct for Drizzle ORM
        // to get the inserted row. No changes needed here based on the instruction.
        const newQuestion = await db.insert(questions).values({
            text,
            category,
            status: "ACTIVE"
        }).returning().then(res => res[0]);


        return NextResponse.json(newQuestion);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
    }
}
