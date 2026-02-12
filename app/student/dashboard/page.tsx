
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { surveyResponses, questions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import SurveyForm from "./_components/SurveyForm";
import SurveyResult from "./_components/SurveyResult";

export default async function StudentDashboard() {
    const session = await getSession();
    if (!session || session.role !== "STUDENT") {
        redirect("/login");
    }

    const response = await db.select().from(surveyResponses).where(eq(surveyResponses.studentId, session.id as string)).get();

    if (response) {
        return <SurveyResult score={response.score} />;
    }

    const activeQuestions = await db.select().from(questions).where(eq(questions.status, "ACTIVE")).all();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Student Happiness Survey</h1>
                        <p className="text-gray-600 mt-2">Please answer the following questions honestly to help us understand your needs better.</p>
                    </div>
                    <SurveyForm questions={activeQuestions} />
                </div>
            </div>
        </div>
    );
}
