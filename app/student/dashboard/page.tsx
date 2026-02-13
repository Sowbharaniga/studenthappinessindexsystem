
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
        <div className="min-h-screen bg-[linear-gradient(135deg,#EEF2FF,30%,#BAE6FD)] p-6 lg:p-12">
            <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-[0_20px_50px_rgba(79,70,229,0.1)] overflow-hidden border border-white">
                <div className="p-8 lg:p-12">
                    <div className="mb-12">
                        <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight">Student Happiness <span className="text-[#4F46E5]">Survey</span></h1>
                        <p className="text-[#64748B] mt-3 text-lg font-medium">Please answer the following questions honestly to help us understand your needs better.</p>
                    </div>
                    <SurveyForm questions={activeQuestions} />
                </div>
            </div>
        </div>
    );
}
