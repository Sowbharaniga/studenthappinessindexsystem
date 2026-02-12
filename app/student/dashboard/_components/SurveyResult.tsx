"use client";

import { LogOut, GraduationCap, RefreshCcw } from "lucide-react";

interface SurveyResultProps {
    score: number;
}

export default function SurveyResult({ score }: SurveyResultProps) {
    const getHappinessLevel = (score: number) => {
        if (score >= 3.5) return { label: "High", colorClass: "bg-green-100 text-green-700", ringColor: "#22c55e" };
        if (score >= 2) return { label: "Moderate", colorClass: "bg-yellow-100 text-yellow-700", ringColor: "#eab308" };
        return { label: "Low", colorClass: "bg-red-100 text-red-700", ringColor: "#ef4444" };
    };

    const level = getHappinessLevel(score);
    const percentage = (score / 5) * 100;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const handleRetake = async () => {
        if (confirm("Are you sure you want to retake the survey? This will clear your current score.")) {
            // In a real app, we'd clear the response in DB. 
            // For now, let's just refresh to show the form if the logic allows it.
            // (Assuming the dashboard logic shows form if no response exists)
            try {
                const res = await fetch("/api/student/survey/clear", { method: "DELETE" });
                if (res.ok) window.location.reload();
            } catch (err) {
                console.error("Failed to reset survey", err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#f8fafc] flex items-center justify-center p-6 animate-fade-in font-sans">
            <div className="max-w-[500px] w-full bg-white rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden p-8 text-center border border-gray-100">
                {/* Header section with Campus Logo/Icon */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                        <GraduationCap className="w-7 h-7 text-indigo-600" />
                    </div>
                    <h1 className="text-[28px] font-bold text-[#0f172a] leading-tight mb-2">Your Happiness Index</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Based on your recent feedback</p>
                </div>

                {/* Score Section with Circular Progress */}
                <div className="relative flex flex-col items-center justify-center mb-8">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="88"
                                cy="88"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-gray-100"
                            />
                            <circle
                                cx="88"
                                cy="88"
                                r={radius}
                                stroke={level.ringColor}
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-extrabold bg-gradient-to-r from-[#4f46e5] to-[#6366f1] bg-clip-text text-transparent">
                                {score.toFixed(1)}
                            </span>
                            <span className="text-xs font-bold text-gray-400 mt-1">/ 5.0</span>
                        </div>
                    </div>

                    <div className={`mt-6 inline-flex items-center px-5 py-1.5 rounded-full text-xs font-bold shadow-sm ${level.colorClass}`}>
                        {level.label} Happiness
                    </div>
                </div>

                {/* Insight Text */}
                <p className="text-gray-500 text-sm leading-relaxed mb-10 px-4">
                    Your feedback helps us create a better campus experience. High engagement reflects a positive learning environment.
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleRetake}
                        className="w-full flex items-center justify-center gap-2 group border-2 border-indigo-600/10 hover:border-indigo-600 text-indigo-600 font-bold py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95"
                    >
                        <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        Retake Survey
                    </button>

                    <button
                        onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/")}
                        className="w-full flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95"
                    >
                        <LogOut className="w-4 h-4 text-gray-400" />
                        Secure Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
