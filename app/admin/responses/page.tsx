
import { db } from "@/db";
import { users, surveyResponses, departments, questions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ResponsesClient from "./_components/ResponsesClient";

export default async function ResponsesPage() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    // Admin User Info
    const adminUser = await db.select({
        name: users.name,
        username: users.username
    })
        .from(users)
        .where(eq(users.id, session.id as string))
        .then(res => res[0]);

    // Fetch ALL Responses
    const rawResponses = await db.select({
        id: surveyResponses.id,
        score: surveyResponses.score,
        date: surveyResponses.createdAt,
        studentName: users.name,
        rollNo: users.username,
        dept: departments.name,
        answers: surveyResponses.answers
    })
        .from(surveyResponses)
        .leftJoin(users, eq(surveyResponses.studentId, users.id))
        .leftJoin(departments, eq(users.departmentId, departments.id))
        .orderBy(sql`${surveyResponses.createdAt} DESC`);

    // Fetch questions to map IDs to Categories
    const allQuestions = await db.select().from(questions);

    // Format responses for client
    const formattedResponses = rawResponses.map(r => {
        let parsedAnswers = {};
        try {
            parsedAnswers = JSON.parse(r.answers);
        } catch (e) {
            console.error("Failed to parse answers for response", r.id);
        }

        return {
            id: r.id,
            studentName: r.studentName || "Unknown",
            rollNo: r.rollNo || "Unknown",
            department: r.dept || "Unknown",
            score: r.score,
            date: r.date ? new Date(r.date).toISOString() : null,
            answers: parsedAnswers as Record<string, number>
        };
    });

    return (
        <ResponsesClient
            responses={formattedResponses}
            questions={allQuestions.map(q => ({ id: q.id, text: q.text, category: q.category }))}
            adminUser={adminUser}
        />
    );
}
