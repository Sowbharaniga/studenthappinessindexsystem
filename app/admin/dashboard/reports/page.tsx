
import { db } from "@/db";
import { users, surveyResponses, departments } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ReportsClient from "./_components/ReportsClient";

export default async function ReportsPage() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    // Fetch All Responses
    const allResponses = await db.select({
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

    // Fetch Unique Departments for filter
    const allDepts = await db.select({ name: departments.name }).from(departments);

    const deptList = allDepts.map(d => d.name);

    // Format data for client component
    const formattedResponses = allResponses.map(res => ({
        id: res.id,
        score: res.score,
        date: res.date ? new Date(res.date).toISOString() : null,
        studentName: res.studentName || "Unknown Student",
        rollNo: res.rollNo || "N/A",
        dept: res.dept || "General"
    }));

    return <ReportsClient responses={formattedResponses} departments={deptList} />;
}
