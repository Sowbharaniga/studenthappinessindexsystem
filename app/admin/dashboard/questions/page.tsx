
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import QuestionTable from "../_components/QuestionTable";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function QuestionsPage() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <nav className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <span className="text-lg font-bold text-gray-900 tracking-tight">
                                Manage Questions
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <QuestionTable />
            </main>
        </div>
    );
}
