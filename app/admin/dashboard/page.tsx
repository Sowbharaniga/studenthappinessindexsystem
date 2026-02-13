
import { db } from "@/db";
import { users, surveyResponses, departments, questions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./_components/DashboardClient";

export default async function AdminDashboard() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    // Fetch Stats
    // 1. Total Students
    const totalStudents = (await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "STUDENT")).then(res => res[0]))?.count || 0;

    // 2. Total Responses
    const totalResponses = (await db.select({ count: sql<number>`count(*)` }).from(surveyResponses).then(res => res[0]))?.count || 0;

    // 3. Average Happiness Score
    const avgScore = (await db.select({ avg: sql<number>`avg(${surveyResponses.score})` }).from(surveyResponses).then(res => res[0]))?.avg || 0;

    // 4. Department-wise analysis
    const deptStats = await db.select({
        name: departments.name,
        avgScore: sql<number>`avg(${surveyResponses.score})`,
        count: sql<number>`count(${surveyResponses.id})`
    })
        .from(departments)
        .leftJoin(users, eq(users.departmentId, departments.id))
        .leftJoin(surveyResponses, eq(surveyResponses.studentId, users.id))
        .groupBy(departments.id, departments.name);

    // 5. Recent Responses (Fetch ALL for client-side filtering/charts if needed, but limit to reasonable amount or paginate in real app)
    // For this dashboard, we fetch recent 50 for the table/charts to show immediate activity. 
    // Ideally we'd fetch aggregate stats separately from the list.
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
        .orderBy(sql`${surveyResponses.createdAt} DESC`)
        .limit(50); // Fetching more for better charts

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

    // 6. Admin User Info
    const adminUser = await db.select({
        name: users.name,
        username: users.username
    })
        .from(users)
        .where(eq(users.id, session.id as string))
        .then(res => res[0]);

    return (
        <DashboardClient
            stats={{
                totalStudents,
                totalResponses,
                avgScore,
                departmentStats: deptStats.map(d => ({
                    name: d.name,
                    avgScore: d.avgScore || 0,
                    responseCount: d.count || 0
                }))
            }}
            responses={formattedResponses}
            questions={allQuestions.map(q => ({ id: q.id, text: q.text, category: q.category }))}
            adminUser={adminUser}
        />
    );
}
