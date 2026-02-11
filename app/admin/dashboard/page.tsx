
import { db } from "@/db";
import { users, surveyResponses, departments } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardContent from "./_components/DashboardContent";

export default async function AdminDashboard() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    // Fetch Stats
    // 1. Total Students
    const totalStudentsResult = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "STUDENT")).get();
    const totalStudents = totalStudentsResult?.count || 0;

    // 2. Total Responses
    const totalResponsesResult = await db.select({ count: sql<number>`count(*)` }).from(surveyResponses).get();
    const totalResponses = totalResponsesResult?.count || 0;

    // 3. Average Happiness Score
    const avgScoreResult = await db.select({ avg: sql<number>`avg(${surveyResponses.score})` }).from(surveyResponses).get();
    const avgScore = avgScoreResult?.avg || 0;

    // 4. Department-wise analysis
    // We need to join users -> departments and then group by department
    // Since this sqlite setup might be simple, let's do a join query or two steps
    const deptStats = await db.select({
        name: departments.name,
        avgScore: sql<number>`avg(${surveyResponses.score})`,
        count: sql<number>`count(${surveyResponses.id})`
    })
        .from(departments)
        .leftJoin(users, eq(users.departmentId, departments.id))
        .leftJoin(surveyResponses, eq(surveyResponses.studentId, users.id))
        .groupBy(departments.id)
        .all();

    // 5. Recent Responses
    const recentResponses = await db.select({
        id: surveyResponses.id,
        score: surveyResponses.score,
        date: surveyResponses.createdAt,
        studentName: users.name,
        rollNo: users.username,
        dept: departments.name
    })
        .from(surveyResponses)
        .leftJoin(users, eq(surveyResponses.studentId, users.id))
        .leftJoin(departments, eq(users.departmentId, departments.id))
        .orderBy(sql`${surveyResponses.createdAt} DESC`)
        .limit(10)
        .all();

    return (
        <DashboardContent
            stats={{
                totalStudents,
                totalResponses,
                avgScore,
                departmentStats: deptStats.map(d => ({
                    name: d.name,
                    avgScore: d.avgScore || 0,
                    responseCount: d.count || 0
                })),
                recentResponses: recentResponses.map(r => ({
                    id: r.id,
                    studentName: r.studentName || "Unknown",
                    rollNo: r.rollNo || "Unknown",
                    department: r.dept || "Unknown",
                    score: r.score,
                    date: r.date?.toISOString() || ""
                }))
            }}
        />
    );
}
