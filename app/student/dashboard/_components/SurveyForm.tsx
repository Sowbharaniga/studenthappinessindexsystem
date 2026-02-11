
"use client";

import { useActionState } from "react";
import { submitSurvey } from "../../actions";

const categories = [
    {
        title: "Academics",
        questions: [
            { id: "q-academic-load", text: "How manageable is your academic workload?" },
            { id: "q-teaching", text: "How satisfied are you with the teaching quality?" },
        ]
    },
    {
        title: "Facilities",
        questions: [
            { id: "q-infrastructure", text: "How would you rate the classroom and lab infrastructure?" },
            { id: "q-hostel", text: "How satisfied are you with hostel/campus facilities?" },
        ]
    },
    {
        title: "Personal Well-being",
        questions: [
            { id: "q-stress", text: "How well are you able to manage stress?" },
            { id: "q-social", text: "How satisfied are you with your social life on campus?" },
        ]
    }
];

const initialState = {
    message: "",
    error: ""
}

export default function SurveyForm() {
    const [state, formAction, isPending] = useActionState(submitSurvey, initialState);

    return (
        <form action={formAction} className="space-y-8">
            {state?.error && (
                <div className="p-4 rounded-md bg-red-50 text-red-600 border border-red-200">
                    {state.error}
                </div>
            )}

            {categories.map((cat, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-6 last:border-0">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{cat.title}</h3>
                    <div className="space-y-6">
                        {cat.questions.map((q) => (
                            <div key={q.id}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {q.text}
                                </label>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <label key={val} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={q.id}
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
