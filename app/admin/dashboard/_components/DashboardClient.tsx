"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import {
    Users, FileText, TrendingUp, AlertCircle,
    Search, Filter, ChevronRight, X, User, Settings, BarChart as BarChartIcon
} from "lucide-react";

// --- Types ---

type Question = {
    id: string;
    text: string;
    category: string;
};

type DepartmentStats = {
    name: string;
    avgScore: number;
    responseCount: number;
};

type StudentResponse = {
    id: string;
    studentName: string;
    rollNo: string;
    department: string;
    score: number;
    date: string | null;
    answers: Record<string, number>; // parsed JSON: { "q-id": score }
};

type Props = {
    stats: {
        totalStudents: number;
        totalResponses: number;
        avgScore: number;
        departmentStats: DepartmentStats[];
    };
    responses: StudentResponse[];
    questions: Question[];
    adminUser: { name: string | null; username: string } | undefined;
};

// --- Helper Functions ---

const COLORS = {
    green: "#10B981", // Emerald 500
    yellow: "#F59E0B", // Amber 500
    red: "#EF4444",   // Red 500
    primary: "#6366F1", // Indigo 500
    neutral: "#94A3B8" // Slate 400
};

const getColorForScore = (score: number) => {
    if (score >= 4) return COLORS.green;
    if (score >= 3) return COLORS.yellow;
    return COLORS.red;
};

// --- Components ---

export default function DashboardClient({ stats, responses, questions, adminUser }: Props) {
    const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);

    // --- Analytics Logic ---

    // 1. Calculate Category Averages (Overall)
    const categoryStats = useMemo(() => {
        const catTotals: Record<string, { sum: number; count: number }> = {};

        responses.forEach(r => {
            Object.entries(r.answers).forEach(([key, score]) => {
                // key is "q-ID"
                const qId = key.replace("q-", "");
                const question = questions.find(q => q.id === qId);
                if (question) {
                    if (!catTotals[question.category]) {
                        catTotals[question.category] = { sum: 0, count: 0 };
                    }
                    catTotals[question.category].sum += score;
                    catTotals[question.category].count += 1;
                }
            });
        });

        const data = Object.entries(catTotals).map(([name, val]) => ({
            name,
            value: Number((val.sum / val.count).toFixed(1))
        }));

        // Sort by value ascending (lowest first) for "Needs Improvement"
        return data.sort((a, b) => a.value - b.value);
    }, [responses, questions]);

    const lowestCategory = categoryStats.length > 0 ? categoryStats[0] : null;

    // 2. Student Specific Stats (for Modal)
    const studentStats = useMemo(() => {
        if (!selectedStudent) return [];

        const catTotals: Record<string, { sum: number; count: number }> = {};

        Object.entries(selectedStudent.answers).forEach(([key, score]) => {
            const qId = key.replace("q-", "");
            const question = questions.find(q => q.id === qId);
            if (question) {
                if (!catTotals[question.category]) {
                    catTotals[question.category] = { sum: 0, count: 0 };
                }
                catTotals[question.category].sum += score;
                catTotals[question.category].count += 1;
            }
        });

        return Object.entries(catTotals).map(([name, val]) => ({
            name,
            score: Number((val.sum / val.count).toFixed(1))
        }));
    }, [selectedStudent, questions]);


    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">

            {/* Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back, {adminUser?.name || "Admin"}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/dashboard/questions"
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-105 hover:shadow-indigo-500/30 transition-all duration-300 font-medium text-sm group"
                    >
                        <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                        Manage Questions
                    </Link>
                    <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100 hidden sm:flex">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-slate-600">System Active</span>
                    </div>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <KpiCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={Users}
                    color="blue"
                />
                <KpiCard
                    title="Survey Responses"
                    value={stats.totalResponses}
                    icon={FileText}
                    color="indigo"
                />
                <KpiCard
                    title="Avg Happiness"
                    value={stats.avgScore.toFixed(1)}
                    icon={TrendingUp}
                    color={getColorForScore(stats.avgScore)}
                    isScore
                />
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

                {/* Improvement Insights (Pie Chart) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-500" />
                            Improvement Insights
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Category performance breakdown</p>
                    </div>

                    <div className="flex-1 min-h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryStats}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getColorForScore(entry.value)} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Centered Label for Priority Area */}
                        {lowestCategory && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</span>
                                <span className="text-sm font-bold text-slate-800 text-center px-4 leading-tight mt-1">
                                    {lowestCategory.name}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {categoryStats.map((cat) => (
                            <div key={cat.name} className="flex items-center gap-1.5 text-xs bg-slate-50 px-2 py-1 rounded-md">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getColorForScore(cat.value) }}></div>
                                <span className="text-slate-600 font-medium">{cat.name}: {cat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                    <div className="mb-6 flex justify-between items-end">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-500" />
                                Recent Responses
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Latest student feedback submissions</p>
                        </div>
                        <Link
                            href="/admin/responses"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 group"
                        >
                            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Student</th>
                                    <th className="py-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Dept</th>
                                    <th className="py-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="py-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Score</th>
                                    <th className="py-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {responses.slice(0, 10).map((r) => (
                                    <tr
                                        key={r.id}
                                        className="group hover:bg-slate-50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedStudent(r)}
                                    >
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                    {r.studentName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">{r.studentName}</div>
                                                    <div className="text-xs text-slate-400">{r.rollNo}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-sm text-slate-600">{r.department}</td>
                                        <td className="py-3 px-2 text-sm text-slate-500">
                                            {r.date ? new Date(r.date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="py-3 px-2 text-right">
                                            <span
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                style={{
                                                    backgroundColor: `${getColorForScore(r.score)}15`,
                                                    color: getColorForScore(r.score)
                                                }}
                                            >
                                                {r.score.toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-right">
                                            <span className="text-xs font-medium text-slate-400 group-hover:text-indigo-500 transition-colors">
                                                View
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {responses.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                                            No responses yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Department Happiness Overview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-10 transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <BarChartIcon className="w-5 h-5 text-indigo-500" />
                            Department Happiness Overview
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Average happiness score by department</p>
                    </div>
                    {(() => {
                        const sortedDepts = [...stats.departmentStats].sort((a, b) => a.avgScore - b.avgScore);
                        const lowest = sortedDepts.length > 0 ? sortedDepts[0] : null;
                        if (!lowest) return null;

                        const isCritical = lowest.avgScore < 3;
                        return (
                            <div className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border ${isCritical ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                <AlertCircle className="w-4 h-4" />
                                <span>Lowest Performing: {lowest.name} ({lowest.avgScore.toFixed(1)})</span>
                            </div>
                        );
                    })()}
                </div>

                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={stats.departmentStats}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            barSize={32}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#E2E8F0" />
                            <XAxis type="number" domain={[0, 5]} hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fontSize: 13, fill: '#475569', fontWeight: 500 }}
                                width={120}
                                axisLine={false}
                                tickLine={false}
                            />
                            <RechartsTooltip
                                cursor={{ fill: '#F8FAFC' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number | undefined) => [
                                    typeof value === "number" ? value.toFixed(1) : "0.0",
                                    "Avg Score"
                                ]}
                            />
                            <Bar dataKey="avgScore" radius={[0, 6, 6, 0]} animationDuration={1000}>
                                {stats.departmentStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getColorForScore(entry.avgScore)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {selectedStudent.studentName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedStudent.studentName}</h3>
                                    <p className="text-sm text-slate-500 flex items-center gap-2">
                                        <span>{selectedStudent.rollNo}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span>{selectedStudent.department}</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="text-sm text-slate-500">Overall Happiness Score</div>
                                <div
                                    className="text-3xl font-bold"
                                    style={{ color: getColorForScore(selectedStudent.score) }}
                                >
                                    {selectedStudent.score.toFixed(1)} <span className="text-lg text-slate-400 font-medium">/ 5.0</span>
                                </div>
                            </div>

                            <div className="h-64 mb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={studentStats} layout="vertical" margin={{ left: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                        <XAxis type="number" domain={[0, 5]} hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={100}
                                            tick={{ fontSize: 11, fill: '#64748B' }}
                                        />
                                        <RechartsTooltip
                                            cursor={{ fill: '#F1F5F9' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: number | undefined) => [
                                                typeof value === "number" ? value.toFixed(1) : "0.0",
                                                "Score"
                                            ]}
                                        />
                                        <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                                            {studentStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={getColorForScore(entry.score)} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

// Sub-Component: KPI Card

function KpiCard({ title, value, icon: Icon, color, isScore = false }: any) {
    // A simple mapping for bg colors based on props, defaulting to indigo
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        red: "bg-red-50 text-red-600"
    };

    // If color is a hex code (from getColorForScore), handle safely or default
    const isHex = color?.startsWith("#");
    const iconStyle = isHex ? { color, backgroundColor: `${color}15` } : {};
    const iconClass = isHex ? "" : colorClasses[color] || colorClasses.indigo;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
                </div>
                <div
                    className={`p-3 rounded-xl ${iconClass}`}
                    style={iconStyle}
                >
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {isScore ? (
                <div className="text-sm">
                    <span className="font-semibold" style={{ color: isHex ? color : '#6366F1' }}>
                        Based on recent surveys
                    </span>
                </div>
            ) : (
                <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>Updated just now</span>
                </div>
            )}
        </div>
    );
}

