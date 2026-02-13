
import { NextResponse } from "next/server";
import { db } from "@/db";
import { surveyResponses } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { sql } from "drizzle-orm";


export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "STUDENT") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { answers } = await request.json(); // Array of values 1-5

        // Calculate Score
        const totalScore = answers.reduce((a: number, b: number) => a + b, 0);
        const maxScore = answers.length * 5;
        const percentage = (totalScore / maxScore) * 100;

        // Store in DB
        await db.insert(surveyResponses).values({
            studentId: session.id as string,
            score: percentage,
            answers: JSON.stringify(answers),
        }).onConflictDoUpdate({
            target: surveyResponses.studentId,
            set: {
                score: percentage,
                answers: JSON.stringify(answers),
                createdAt: sql`CURRENT_TIMESTAMP`
            }
        });


        return NextResponse.json({ success: true, score: percentage });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to submit survey" }, { status: 500 });
    }
}
