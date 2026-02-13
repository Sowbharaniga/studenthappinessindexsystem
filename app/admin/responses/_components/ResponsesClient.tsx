"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Users, FileText, TrendingUp, AlertCircle,
    Search, Filter, ChevronRight, X, User, ChevronLeft
} from "lucide-react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

// --- Types ---

type Question = {
    id: string;
    text: string;
    category: string;
};

type Item = {
    id: string;
    studentName: string;
    rollNo: string;
    department: string;
    score: number;
    date: string | null;
    answers: Record<string, number>;
};

type Props = {
    responses: Item[];
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

export default function ResponsesClient({ responses, questions, adminUser }: Props) {
    const [selectedStudent, setSelectedStudent] = useState<Item | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter logic
    const filteredResponses = responses.filter(r =>
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats for Modal
    const studentStats = selectedStudent ? (() => {
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
    })() : [];


    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">

            {/* Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/dashboard" className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">All Student Responses</h1>
                    <p className="text-slate-500 mt-1">Complete survey submissions overview</p>
                </div>
            </header>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

                {/* Search / Filter Bar */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search student, roll no..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Add filter dropdowns later if needed */}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Dept</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Score</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredResponses.map((r) => (
                                <tr
                                    key={r.id}
                                    className="group hover:bg-slate-50 transition-colors cursor-pointer"
                                    onClick={() => setSelectedStudent(r)}
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                {r.studentName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">{r.studentName}</div>
                                                <div className="text-xs text-slate-400">{r.rollNo}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-600">{r.department}</td>
                                    <td className="py-4 px-6 text-sm text-slate-500">
                                        {r.date ? new Date(r.date).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <span
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                            style={{
                                                backgroundColor: `${getColorForScore(r.score)}15`,
                                                color: getColorForScore(r.score)
                                            }}
                                        >
                                            {r.score.toFixed(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <span className="text-xs font-medium text-slate-400 group-hover:text-indigo-500 transition-colors">
                                            View Details
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredResponses.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                                        No responses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Student Detail Modal (Reused Logic) */}
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
