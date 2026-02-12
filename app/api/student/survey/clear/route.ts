
import { NextResponse } from "next/server";
import { db } from "@/db";
import { surveyResponses } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function DELETE() {
    try {
        const session = await getSession();
        if (!session || session.role !== "STUDENT") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Delete the student's response
        await db.delete(surveyResponses).where(eq(surveyResponses.studentId, session.id as string));

        return NextResponse.json({ success: true, message: "Survey response cleared" });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to reset survey" }, { status: 500 });
    }
}
