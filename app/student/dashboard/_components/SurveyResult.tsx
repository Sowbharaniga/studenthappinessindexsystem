
"use client";

import { LogOut } from "lucide-react";

interface SurveyResultProps {
    score: number;
}

export default function SurveyResult({ score }: SurveyResultProps) {
    const getHappinessLevel = (score: number) => {
        if (score >= 4) return { label: "High", color: "text-emerald-600" };
        if (score >= 2.5) return { label: "Moderate", color: "text-amber-600" };
        return { label: "Low", color: "text-red-600" };
    };

    const level = getHappinessLevel(score);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Happiness Index</h1>
                <p className="text-gray-500 mb-8">Based on your recent survey responses</p>

                <div className="py-8 relative">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-7xl font-bold text-indigo-600 tracking-tighter">
                            {score.toFixed(1)}
                        </span>
                        <span className="text-2xl text-gray-400 font-medium self-end mb-2">/ 5</span>
                    </div>
                    <div className={`text-xl font-semibold ${level.color} bg-gray-50 inline-block px-4 py-1 rounded-full`}>
                        {level.label} Happiness
                    </div>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    Thank you for participating! Your feedback is crucial for improving our campus environment.
                </p>

                <button
                    onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/login")}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-all duration-200"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
