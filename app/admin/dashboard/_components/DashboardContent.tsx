
"use client";

import { useMemo } from "react";
import {
    Users,
    FileText,
    TrendingUp,
    LogOut,
    BarChart3,
    Calendar,
    LayoutDashboard
} from "lucide-react";

interface DashboardProps {
    stats: {
        totalStudents: number;
        totalResponses: number;
        avgScore: number;
        departmentStats: {
            name: string;
            avgScore: number;
            responseCount: number;
        }[];
        recentResponses: {
            id: string;
            studentName: string;
            rollNo: string;
            department: string;
            score: number;
            date: string;
        }[];
    };
}

export default function DashboardContent({ stats }: DashboardProps) {
    const responseRate = stats.totalStudents > 0
        ? ((stats.totalResponses / stats.totalStudents) * 100).toFixed(1)
        : "0";

    const getHappinessData = (score: number) => {
        if (score >= 4) return { label: "High", color: "text-green-700 bg-green-50 border-green-200" };
        if (score >= 2.5) return { label: "Moderate", color: "text-amber-700 bg-amber-50 border-amber-200" };
        return { label: "Low", color: "text-red-700 bg-red-50 border-red-200" };
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Sticky Header */}
            <nav className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="text-lg font-bold text-gray-900 tracking-tight">
                                Happiness Admin
                            </span>
                        </div>
                        <button
                            onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/login")}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        title="Overall Happiness Index"
                        value={stats.avgScore.toFixed(2)}
                        subtext="Average score across all departments"
                        icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
                        trendColor="text-emerald-600"
                    />
                    <StatsCard
                        title="Total Responses"
                        value={stats.totalResponses.toString()}
                        subtext={`From ${stats.totalStudents} registered students`}
                        icon={<FileText className="w-6 h-6 text-blue-600" />}
                        trendColor="text-blue-600"
                    />
                    <StatsCard
                        title="Response Rate"
                        value={`${responseRate}%`}
                        subtext="Overall student participation"
                        icon={<BarChart3 className="w-6 h-6 text-violet-600" />}
                        trendColor="text-violet-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Department Analysis */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                Department Analysis
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Department</th>
                                        <th className="px-6 py-3 text-center">Responses</th>
                                        <th className="px-6 py-3 text-center">Avg Score</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {stats.departmentStats.map((dept) => {
                                        const status = getHappinessData(dept.avgScore);
                                        return (
                                            <tr key={dept.name} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">{dept.name}</td>
                                                <td className="px-6 py-4 text-center text-gray-600">{dept.responseCount}</td>
                                                <td className="px-6 py-4 text-center font-semibold text-gray-900">{dept.avgScore.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Responses */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                Recent Activity
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Student</th>
                                        <th className="px-6 py-3">Score</th>
                                        <th className="px-6 py-3 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {stats.recentResponses.map((res) => {
                                        const status = getHappinessData(res.score);
                                        return (
                                            <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">{res.studentName}</span>
                                                        <span className="text-xs text-gray-500">{res.department}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                                                        {res.score.toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-gray-500">
                                                    {new Date(res.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatsCard({ title, value, subtext, icon, trendColor }: { title: string, value: string, subtext: string, icon: React.ReactNode, trendColor: string }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/60 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
                    <div className={`text-3xl font-bold ${trendColor}`}>
                        {value}
                    </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                    {icon}
                </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">
                {subtext}
            </p>
        </div>
    );
}
