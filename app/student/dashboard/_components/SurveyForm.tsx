
"use client";

import { useActionState } from "react";
import { submitSurvey } from "../../actions";

const initialState = {
    message: "",
    error: ""
}

interface Question {
    id: string;
    text: string;
    category: string;
}

export default function SurveyForm({ questions }: { questions: Question[] }) {
    const [state, formAction, isPending] = useActionState(submitSurvey, initialState);

    // Group questions by category
    const groupedQuestions = questions.reduce((acc, q) => {
        if (!acc[q.category]) {
            acc[q.category] = [];
        }
        acc[q.category].push(q);
        return acc;
    }, {} as Record<string, Question[]>);

    // Defined order for categories if needed, or just Object.keys
    const categoriesOrder = [
        "Academics",
        "Facilities & Infrastructure",
        "Learning Resources",
        "Personal Well-being",
        "Social & Campus Life",
        "Career & Growth",
        "Overall"
    ];

    // Sort categories based on defined order, others at the end
    const sortedCategories = Object.keys(groupedQuestions).sort((a, b) => {
        const indexA = categoriesOrder.indexOf(a);
        const indexB = categoriesOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return (
        <form action={formAction} className="space-y-12">
            {state?.error && (
                <div className="p-4 rounded-xl bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2] font-semibold text-center">
                    {state.error}
                </div>
            )}

            {sortedCategories.map((category) => (
                <div key={category} className="bg-[#F8FAFC] rounded-2xl p-6 lg:p-8 border border-[#F1F5F9]">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1 h-6 bg-[#4F46E5] rounded-full"></div>
                        <h3 className="text-xl font-bold text-[#0F172A]">{category}</h3>
                    </div>
                    <div className="space-y-10">
                        {groupedQuestions[category].map((q) => (
                            <div key={q.id}>
                                <label className="block text-base font-bold text-[#334155] mb-4">
                                    {q.text}
                                </label>
                                <div className="grid grid-cols-5 gap-3 max-w-sm">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <label key={val} className="relative group cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`q-${q.id}`}
                                                value={val}
                                                required
                                                className="peer sr-only"
                                            />
                                            <div className="flex items-center justify-center w-full h-12 bg-white border-2 border-[#E2E8F0] rounded-xl text-[#64748B] font-bold text-lg transition-all peer-checked:bg-[#4F46E5] peer-checked:border-[#4F46E5] peer-checked:text-white peer-checked:shadow-[0_8px_20px_rgba(79,70,229,0.3)] group-hover:border-[#4F46E5]/30">
                                                {val}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs font-bold text-[#94A3B8] mt-3 px-1 uppercase tracking-wider">
                                    <span>Very Dissatisfied</span>
                                    <span>Very Satisfied</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="pt-6">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-4 px-6 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-lg font-bold rounded-2xl shadow-[0_12px_30px_rgba(79,70,229,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                    {isPending ? "Submitting Survey..." : "Submit My Survey"}
                </button>
            </div>
        </form>
    );
}
