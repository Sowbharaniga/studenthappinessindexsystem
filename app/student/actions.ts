
"use server";

import { db } from "@/db";
import { surveyResponses, departments } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function submitSurvey(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
        return { error: "Unauthorized" };
    }

    try {
        // Parse answers
        const answers: Record<string, number> = {};
        let totalScore = 0;
        let count = 0;

        // Assuming questions are named q1, q2, etc. or by category
        // We will accept any field starting with "q-" as a question score (1-5 or 1-10)
        // Adjust logic based on actual form implementation. 
        // For this system, let's assume we have fixed categories in the form.

        for (const [key, value] of formData.entries()) {
            if (key.startsWith("q-")) {
                const score = parseInt(value as string);
                if (!isNaN(score)) {
                    answers[key] = score;
                    totalScore += score;
                    count++;
                }
            }
        }

        if (count === 0) {
            return { error: "No answers provided" };
        }

        const averageScore = totalScore / count;

        // Check if already submitted
        const existing = await db.select().from(surveyResponses).where(eq(surveyResponses.studentId, session.id as string)).get();

        if (existing) {
            return { error: "You have already submitted the survey." };
        }

        await db.insert(surveyResponses).values({
            studentId: session.id as string,
            score: averageScore,
            answers: JSON.stringify(answers),
        });

        revalidatePath("/student/dashboard");
        return { success: true };

    } catch (e) {
        console.error(e);
        return { error: "Failed to submit survey" };
    }
}
