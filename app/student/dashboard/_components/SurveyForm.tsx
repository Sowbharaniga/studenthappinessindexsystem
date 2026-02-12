
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
        <form action={formAction} className="space-y-8">
            {state?.error && (
                <div className="p-4 rounded-md bg-red-50 text-red-600 border border-red-200">
                    {state.error}
                </div>
            )}

            {sortedCategories.map((category) => (
                <div key={category} className="border-b border-gray-100 pb-6 last:border-0">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{category}</h3>
                    <div className="space-y-6">
                        {groupedQuestions[category].map((q) => (
                            <div key={q.id}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {q.text}
                                </label>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <label key={val} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`q-${q.id}`}
                                                value={val}
                                                required
                                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <span className="text-sm text-gray-600">{val}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                                    <span>Very Dissatisfied</span>
                                    <span>Very Satisfied</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isPending ? "Submitting..." : "Submit Survey"}
                </button>
            </div>
        </form>
    );
}
