"use client";

import {
    Users,
    FileText,
    TrendingUp,
    LogOut,
    LayoutDashboard,
    Plus,
    ChevronDown,
    ArrowUpRight,
    Search,
    Filter,
    MoreHorizontal,
    Bell,
    Settings,
    UserCircle,
    ChevronRight,
    ArrowUpDown,
    Check
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

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
    adminUser?: {
        name: string | null;
        username: string;
    };
}

export default function DashboardContent({ stats, adminUser }: DashboardProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
    const [filterName, setFilterName] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const adminName = adminUser?.name || "Admin";
    const adminEmail = adminUser?.username ? (adminUser.username.includes('@') ? adminUser.username : `${adminUser.username}@system.com`) : "admin@system.com";
    const adminInitials = adminUser?.name ? getInitials(adminUser.name) : "AD";

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const processedDepartmentStats = useMemo(() => {
        let data = [...stats.departmentStats];

        if (filterName) {
            data = data.filter(d => d.name === filterName);
        }

        if (sortConfig) {
            data.sort((a: any, b: any) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return data;
    }, [stats.departmentStats, sortConfig, filterName]);

    const responseRate = stats.totalStudents > 0
        ? ((stats.totalResponses / stats.totalStudents) * 100).toFixed(1)
        : "0";

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
            {/* Header remains same */}
            <header className="sticky top-0 z-30 w-full bg-white border-b border-[#E2E8F0]">
                {/* ... header content ... */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left: Breadcrumbs & Logo */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#4F46E5] rounded-lg shadow-sm">
                                    <LayoutDashboard className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-[#0F172A] tracking-tight">
                                    Admin Portal
                                </span>
                            </div>
                            <div className="h-6 w-px bg-[#E2E8F0]"></div>
                            <nav className="hidden md:flex items-center text-sm font-medium text-[#64748B]">
                                <span className="hover:text-[#0F172A] transition-colors cursor-pointer">Dashboard</span>
                                <ChevronRight className="w-4 h-4 mx-2 text-[#CBD5E1]" />
                                <span className="text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-md">Overview</span>
                            </nav>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/dashboard/questions"
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 text-white text-sm font-semibold rounded-full shadow-sm transition-all duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                Manage Questions
                            </Link>

                            <div className="flex items-center gap-3 border-l border-[#E2E8F0] pl-4">
                                <button className="p-2 text-[#64748B] hover:text-[#4F46E5] hover:bg-[#EEF2FF] rounded-full transition-colors relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-white"></span>
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 p-1 pr-3 hover:bg-[#F1F5F9] rounded-full border border-transparent hover:border-[#E2E8F0] transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                            {adminInitials}
                                        </div>
                                        <span className="text-sm font-medium text-[#0F172A] hidden sm:block">{adminName}</span>
                                        <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                                    </button>

                                    {/* Dropdown */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-[#E2E8F0] py-1 animate-in fade-in zoom-in-95 duration-200 focus:outline-none z-50">
                                            <div className="px-4 py-2 border-b border-[#F1F5F9]">
                                                <p className="text-xs font-semibold text-[#64748B] uppercase">Account</p>
                                                <p className="text-sm font-medium text-[#0F172A] truncate">{adminEmail}</p>
                                            </div>
                                            <Link
                                                href="/admin/dashboard/profile"
                                                className="w-full text-left px-4 py-2 text-sm text-[#64748B] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"
                                            >
                                                <UserCircle className="w-4 h-4" /> Profile
                                            </Link>
                                            <Link
                                                href="/admin/dashboard/settings"
                                                className="w-full text-left px-4 py-2 text-sm text-[#64748B] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"
                                            >
                                                <Settings className="w-4 h-4" /> Settings
                                            </Link>
                                            <div className="h-px bg-[#F1F5F9] my-1"></div>
                                            <button
                                                onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/")}
                                                className="w-full text-left px-4 py-2 text-sm text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">

                {/* 1. KPIs - Top Row (2 Cards Only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <KPICard
                        title="Total Responses"
                        value={stats.totalResponses.toLocaleString()}
                        trend="+24"
                        trendUp={true}
                        icon={<FileText className="w-6 h-6 text-[#4F46E5]" />}
                        subtext="Submissions"
                    />
                    <KPICard
                        title="Response Rate"
                        value={`${responseRate}%`}
                        trend="-1.2%"
                        trendUp={false}
                        icon={<Users className="w-6 h-6 text-[#7C3AED]" />}
                        subtext="Engagement"
                        progress={parseFloat(responseRate)}
                    />
                </div>

                {/* Chart Removed for Cleaner Layout */}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Department Table */}
                    <div className="xl:col-span-2 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-[#F1F5F9] overflow-hidden flex flex-col">
                        <div className="px-8 py-6 border-b border-[#F1F5F9] flex items-center justify-between bg-white">
                            <div>
                                <h3 className="text-lg font-bold text-[#0F172A]">Department Overview</h3>
                                <p className="text-sm text-[#64748B]">Detailed breakdown by department</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                                    <input
                                        placeholder="Search..."
                                        className="pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] w-48 transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className={`p-2 border rounded-lg hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors ${filterName ? 'border-[#4F46E5] text-[#4F46E5] bg-[#EEF2FF]' : 'border-[#E2E8F0] text-[#64748B]'}`}
                                    >
                                        <Filter className="w-4 h-4" />
                                        {filterName && <span className="text-xs font-semibold">{filterName}</span>}
                                    </button>

                                    {isFilterOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#F1F5F9] py-1 z-20 animate-in fade-in zoom-in-95">
                                            <button
                                                onClick={() => { setFilterName(""); setIsFilterOpen(false); }}
                                                className="w-full text-left px-4 py-2 text-sm text-[#64748B] hover:bg-[#F8FAFC] flex items-center justify-between"
                                            >
                                                All Departments
                                                {filterName === "" && <Check className="w-3 h-3 text-[#4F46E5]" />}
                                            </button>
                                            {stats.departmentStats.map((d) => (
                                                <button
                                                    key={d.name}
                                                    onClick={() => { setFilterName(d.name); setIsFilterOpen(false); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-[#64748B] hover:bg-[#F8FAFC] flex items-center justify-between"
                                                >
                                                    {d.name}
                                                    {filterName === d.name && <Check className="w-3 h-3 text-[#4F46E5]" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold uppercase tracking-wider text-xs">
                                    <tr>
                                        <th
                                            className="px-6 py-4 cursor-pointer hover:bg-[#E2E8F0] transition-colors group select-none"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Department
                                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-4 text-center cursor-pointer hover:bg-[#E2E8F0] transition-colors group select-none"
                                            onClick={() => handleSort('responseCount')}
                                        >
                                            <div className="flex items-center justify-center gap-1">
                                                Responses
                                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-4 text-center cursor-pointer hover:bg-[#E2E8F0] transition-colors group select-none"
                                            onClick={() => handleSort('avgScore')}
                                        >
                                            <div className="flex items-center justify-center gap-1">
                                                Avg Score
                                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F1F5F9]">
                                    {processedDepartmentStats.length > 0 ? (
                                        processedDepartmentStats.map((dept) => {
                                            const status = getHappinessStatus(dept.avgScore);
                                            return (
                                                <tr key={dept.name} className="hover:bg-[#F8FAFC] transition-colors group">
                                                    <td className="px-6 py-4 font-medium text-[#0F172A]">
                                                        {dept.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-[#64748B]">
                                                        {dept.responseCount > 0 ? dept.responseCount : <span className="text-slate-400 italic">No responses</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="font-bold text-[#0F172A]">{dept.avgScore.toFixed(2)}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.classes}`}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#E2E8F0] rounded transition-all text-[#94A3B8]">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-[#94A3B8] italic">
                                                No department data available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-[#F1F5F9] flex flex-col h-full">
                        <div className="px-8 py-6 border-b border-[#F1F5F9] flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[#0F172A]">Recent Activity</h3>
                            <Link href="#" className="text-xs font-semibold text-[#4F46E5] hover:underline">View All</Link>
                        </div>
                        <div className="p-6 space-y-6 overflow-y-auto max-h-[500px]">
                            {stats.recentResponses.length > 0 ? (
                                stats.recentResponses.map((res, i) => (
                                    <div key={res.id} className="relative flex gap-4 group">
                                        {/* Timeline connector */}
                                        {i !== stats.recentResponses.length - 1 && (
                                            <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-[#F1F5F9] group-hover:bg-[#EEF2FF] transition-colors"></div>
                                        )}

                                        <div className="relative z-10 w-10 h-10 rounded-full bg-[#F8FAFC] border-2 border-white shadow-sm flex items-center justify-center text-[#64748B] font-bold text-xs ring-1 ring-[#F1F5F9]">
                                            {getInitials(res.studentName)}
                                        </div>

                                        <div className="flex-1 pb-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-semibold text-[#0F172A]">{res.studentName}</p>
                                                    <p className="text-xs text-[#64748B] mt-0.5">{res.department} • {res.rollNo}</p>
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${getScoreBadgeColor(res.score)}`}>
                                                    {res.score.toFixed(1)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#94A3B8] mt-2">
                                                {new Date(res.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Users className="w-8 h-8 text-[#CBD5E1]" />
                                    </div>
                                    <p className="text-[#64748B] text-sm">No recent activity found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#E2E8F0] mt-12 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#64748B]">
                    <p>© 2026 Student Happiness Index System. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-[#4F46E5] transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-[#4F46E5] transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-[#4F46E5] transition-colors">Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Helper Components & Functions
function KPICard({ title, value, trend, trendUp, icon, subtext, progress }: any) {
    return (
        <div className={`bg-white rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300 border border-[#F1F5F9] group`}>
            <div className="flex items-start justify-between">
                <div>
                    <h4 className="text-sm font-medium text-[#64748B] mb-2">{title}</h4>
                    <div className="text-4xl font-bold text-[#0F172A] tracking-tight flex items-baseline gap-3">
                        {value}
                        <span className={`text-sm font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${trendUp ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#991B1B]'}`}>
                            {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5 rotate-180" />}
                            {trend}
                        </span>
                    </div>
                </div>
                <div className={`p-4 rounded-xl bg-[#EEF2FF]/50 text-[#4F46E5] transition-colors group-hover:scale-105 duration-300`}>
                    {icon}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-[#94A3B8] font-medium">{subtext}</span>
                {progress !== undefined && (
                    <div className="w-32 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div className="h-full bg-[#7C3AED] rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
            </div>
        </div>
    );
}

function getHappinessStatus(score: number) {
    if (score >= 4) return { label: "High", classes: "bg-[#DCFCE7] text-[#166534] border-none" };
    if (score >= 2.5) return { label: "Moderate", classes: "bg-[#FEF3C7] text-[#92400E] border-none" };
    return { label: "Low", classes: "bg-[#FEE2E2] text-[#991B1B] border-none" };
}

function getScoreBadgeColor(score: number) {
    if (score >= 4) return "bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7]";
    if (score >= 2.5) return "bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7]";
    return "bg-[#FEF2F2] text-[#B91C1C] border border-[#FEE2E2]";
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}
