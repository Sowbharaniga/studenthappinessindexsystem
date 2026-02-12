
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Filter, User, Calendar, BookOpen, BarChart3, ChevronDown, X } from "lucide-react";

interface Response {
    id: string;
    score: number;
    date: string | null;
    studentName: string;
    rollNo: string;
    dept: string;
}

interface ReportsClientProps {
    responses: Response[];
    departments: string[];
}

export default function ReportsClient({ responses, departments }: ReportsClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All Departments");
    const [isDeptOpen, setIsDeptOpen] = useState(false);

    const getStatus = (score: number) => {
        // Handle both 1-5 and 0-100 scales
        const isFiveScale = score <= 5;
        const high = isFiveScale ? 3.5 : 80;
        const moderate = isFiveScale ? 2.0 : 50;

        if (score >= high) return { label: "High", classes: "bg-green-100 text-green-700" };
        if (score >= moderate) return { label: "Moderate", classes: "bg-amber-100 text-amber-700" };
        return { label: "Low", classes: "bg-red-100 text-red-700" };
    };

    const filteredResponses = useMemo(() => {
        return responses.filter(res => {
            const matchesSearch =
                res.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = selectedDept === "All Departments" || res.dept === selectedDept;
            return matchesSearch && matchesDept;
        });
    }, [responses, searchTerm, selectedDept]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12">
            {/* Header */}
            <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard"
                            className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-indigo-600"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-[#0F172A]">Detailed Reports</h1>
                            <p className="text-xs font-medium text-gray-500">View and analyze all student happiness indices</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-xl text-sm transition-all outline-none"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="relative w-full md:w-auto">
                        <button
                            onClick={() => setIsDeptOpen(!isDeptOpen)}
                            className="flex items-center justify-between gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl transition-all border border-transparent w-full md:w-64"
                        >
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                {selectedDept}
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isDeptOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDeptOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsDeptOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-full md:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={() => { setSelectedDept("All Departments"); setIsDeptOpen(false); }}
                                        className={`w-full text-left px-5 py-2 text-sm transition-colors ${selectedDept === "All Departments" ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        All Departments
                                    </button>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    {departments.map((dept) => (
                                        <button
                                            key={dept}
                                            onClick={() => { setSelectedDept(dept); setIsDeptOpen(false); }}
                                            className={`w-full text-left px-5 py-2 text-sm transition-colors ${selectedDept === dept ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {dept}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Reports Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-[#F1F5F9] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#F8FAFC] border-y border-gray-100/50 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                <tr>
                                    <th className="px-8 py-5">Student Details</th>
                                    <th className="px-8 py-5">Department</th>
                                    <th className="px-8 py-5 text-center">Happiness Score</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5 text-right">Date Submitted</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/50">
                                {filteredResponses.length > 0 ? (
                                    filteredResponses.map((res, idx) => {
                                        const status = getStatus(res.score);
                                        return (
                                            <tr key={res.id} className={`hover:bg-indigo-50/30 transition-colors group ${idx % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase shadow-sm">
                                                            {res.studentName?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-[#0F172A]">{res.studentName || 'Unknown Student'}</p>
                                                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{res.rollNo || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-gray-600 border border-gray-200 shadow-sm">
                                                        {res.dept || 'General'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className="font-extrabold text-[#0F172A] text-base">
                                                        {res.score <= 5 ? res.score.toFixed(1) : (res.score / 20).toFixed(1)} / 5.0
                                                    </span>
                                                    <p className="text-[9px] text-gray-400 font-bold mt-0.5 uppercase tracking-tighter">({res.score <= 5 ? (res.score * 20).toFixed(0) : res.score.toFixed(0)}%)</p>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold shadow-sm ${status.classes}`}>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right text-gray-400 font-medium whitespace-nowrap">
                                                    {res.date ? new Date(res.date).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : 'N/A'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                                    <Search className="w-6 h-6" />
                                                </div>
                                                <p className="text-gray-400 font-medium">No reports found matching your criteria.</p>
                                                <button
                                                    onClick={() => { setSearchTerm(""); setSelectedDept("All Departments"); }}
                                                    className="text-indigo-600 text-sm font-bold hover:underline"
                                                >
                                                    Clear all filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
