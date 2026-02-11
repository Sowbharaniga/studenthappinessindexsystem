
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, surveyResponses, departments } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Total Students
        const totalStudentsResult = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "STUDENT"));
        const totalStudents = totalStudentsResult[0].count;

        // 2. Average Happiness Score
        const avgScoreResult = await db.select({ avg: sql<number>`avg(${surveyResponses.score})` }).from(surveyResponses);
        const averageHappiness = Math.round(avgScoreResult[0].avg || 0);

        // 3. Department-wise Analysis
        // We need to join departments, users, and responses
        const deptStats = await db
            .select({
                name: departments.name,
                avgScore: sql<number>`avg(${surveyResponses.score})`,
                count: sql<number>`count(${surveyResponses.id})`
            })
            .from(departments)
            .leftJoin(users, eq(users.departmentId, departments.id))
            .leftJoin(surveyResponses, eq(surveyResponses.studentId, users.id))
            .groupBy(departments.id);

        // Clean up nulls
        const formattedDeptStats = deptStats.map(d => ({
            name: d.name,
            avgScore: Math.round(d.avgScore || 0),
            count: d.count
        }));

        return NextResponse.json({
            totalStudents,
            averageHappiness,
            deptStats: formattedDeptStats
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
