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
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] animate-fade-in">
            {/* Header */}
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
                                <span className="hover:text-[#4F46E5] transition-colors cursor-pointer">Dashboard</span>
                                <ChevronRight className="w-4 h-4 mx-2 text-[#CBD5E1]" />
                                <span className="text-[#4F46E5] bg-[#EEF2FF] px-3 py-1 rounded-full font-bold">Overview</span>
                            </nav>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/dashboard/questions"
                                className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 hover:scale-105"
                            >
                                <Plus className="w-4 h-4" />
                                Manage Questions
                            </Link>

                            <Link
                                href="/admin/dashboard/reports"
                                className="hidden xl:flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-bold rounded-xl transition-all duration-200 hover:scale-105 hover:border-gray-300"
                            >
                                <TrendingUp className="w-4 h-4 text-indigo-600" />
                                Reports
                            </Link>

                            <div className="flex items-center gap-3 border-l border-[#E2E8F0] pl-4">
                                <button className="p-2 text-[#64748B] hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all relative group">
                                    <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 p-1 pr-3 hover:bg-[#F1F5F9] rounded-full border border-transparent hover:border-[#E2E8F0] transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-100">
                                            {adminInitials}
                                        </div>
                                        <span className="text-sm font-bold text-[#0F172A] hidden sm:block">{adminName}</span>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
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

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Admin Dashboard</h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">Welcome back, {adminName}. Here's what's happening today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg uppercase tracking-widest">System Status: Optimal</span>
                    </div>
                </div>

                {/* 1. KPIs - Top Row (2 Cards Only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <KPICard
                        title="Total Responses"
                        value={stats.totalResponses.toLocaleString()}
                        trend="+24"
                        trendUp={true}
                        icon={<FileText className="w-6 h-6" />}
                        color="indigo"
                        subtext="Accumulated Submissions"
                    />
                    <KPICard
                        title="Response Rate"
                        value={`${responseRate}%`}
                        trend="-1.2%"
                        trendUp={false}
                        icon={<Users className="w-6 h-6" />}
                        color="purple"
                        subtext="Student Engagement Level"
                        progress={parseFloat(responseRate)}
                    />
                </div>

                {/* Chart Removed for Cleaner Layout */}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Department Table */}
                    <div className="xl:col-span-2 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-[#F1F5F9] overflow-hidden flex flex-col">
                        <div className="px-8 py-6 border-b border-[#F1F5F9] flex items-center justify-between bg-white">
                            <div>
                                <h3 className="text-xl font-extrabold text-[#0F172A]">Department Overview</h3>
                                <p className="text-sm font-medium text-[#94A3B8]">Real-time engagement across departments</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        placeholder="Search departments..."
                                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white w-64 transition-all"
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
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <button
                                                onClick={() => { setFilterName(""); setIsFilterOpen(false); }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-between"
                                            >
                                                All Departments
                                                {filterName === "" && <Check className="w-4 h-4 text-indigo-600" />}
                                            </button>
                                            {stats.departmentStats.map((d) => (
                                                <button
                                                    key={d.name}
                                                    onClick={() => { setFilterName(d.name); setIsFilterOpen(false); }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-between"
                                                >
                                                    {d.name}
                                                    {filterName === d.name && <Check className="w-4 h-4 text-indigo-600" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#F8FAFC] border-y border-gray-100/50 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                    <tr>
                                        <th
                                            className="px-8 py-5 cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                Department
                                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-8 py-5 text-center cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                                            onClick={() => handleSort('responseCount')}
                                        >
                                            <div className="flex items-center justify-center gap-1.5">
                                                Responses
                                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </th>
                                        <th
                                            className="px-8 py-5 text-center cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                                            onClick={() => handleSort('avgScore')}
                                        >
                                            <div className="flex items-center justify-center gap-1.5">
                                                Avg Score
                                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </th>
                                        <th className="px-8 py-5 text-center">Status</th>
                                        <th className="px-8 py-5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {processedDepartmentStats.length > 0 ? (
                                        processedDepartmentStats.map((dept, idx) => {
                                            const status = getHappinessStatus(dept.avgScore);
                                            return (
                                                <tr key={dept.name} className={`hover:bg-indigo-50/30 transition-colors group ${idx % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                                                    <td className="px-8 py-6 font-bold text-[#0F172A]">
                                                        {dept.name}
                                                    </td>
                                                    <td className="px-8 py-6 text-center text-gray-600 font-medium">
                                                        {dept.responseCount > 0 ? (
                                                            <span className="bg-white border border-gray-200 px-3 py-1 rounded-lg shadow-sm">
                                                                {dept.responseCount}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 italic font-normal">No data</span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <span className="font-extrabold text-[#0F172A] text-base">{dept.avgScore.toFixed(2)}</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${status.classes}`}>
                                                            <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></span>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200 rounded-xl transition-all text-gray-400 hover:text-indigo-600">
                                                            <MoreHorizontal className="w-5 h-5" />
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
                            <Link href="/admin/dashboard/reports" className="text-xs font-semibold text-[#4F46E5] hover:underline">View All</Link>
                        </div>
                        <div className="p-8 space-y-8 overflow-y-auto max-h-[600px] scrollbar-hide">
                            {stats.recentResponses.length > 0 ? (
                                stats.recentResponses.map((res, i) => (
                                    <div key={res.id} className="relative flex gap-5 group/item">
                                        {/* Timeline connector */}
                                        {i !== stats.recentResponses.length - 1 && (
                                            <div className="absolute left-6 top-10 bottom-[-32px] w-0.5 bg-gray-100 group-hover/item:bg-indigo-100 transition-colors"></div>
                                        )}

                                        <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white shadow-md flex items-center justify-center text-white font-extrabold text-sm group-hover/item:scale-110 transition-transform duration-300">
                                            {getInitials(res.studentName)}
                                        </div>

                                        <div className="flex-1 bg-white group-hover/item:bg-indigo-50/50 p-4 rounded-2xl border border-transparent group-hover/item:border-indigo-100 transition-all duration-300">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-bold text-[#0F172A] group-hover/item:text-indigo-600 transition-colors">{res.studentName}</p>
                                                    <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-wider">{res.department} • {res.rollNo}</p>
                                                </div>
                                                <div className={`text-xs font-extrabold px-3 py-1 rounded-full shadow-sm ${getScoreBadgeColor(res.score)}`}>
                                                    {res.score.toFixed(1)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-3">
                                                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                                <p className="text-[10px] font-bold text-gray-400">
                                                    {new Date(res.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                        <Users className="w-10 h-10 text-gray-200" />
                                    </div>
                                    <p className="text-gray-400 font-medium">No recent activity detected.</p>
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
function KPICard({ title, value, trend, trendUp, icon, color, subtext, progress }: any) {
    const colorClasses: any = {
        indigo: {
            bg: "bg-indigo-50",
            icon: "text-indigo-600",
            circle: "bg-indigo-100/50"
        },
        purple: {
            bg: "bg-purple-50",
            icon: "text-purple-600",
            circle: "bg-purple-100/50"
        }
    };

    const currentColors = colorClasses[color] || colorClasses.indigo;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#F1F5F9] group relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">{title}</p>
                    <h3 className="text-3xl font-bold text-[#0F172A] mt-2 flex items-baseline gap-2">
                        {value}
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                            {trend}
                        </span>
                    </h3>
                </div>
                <div className={`p-4 rounded-full ${currentColors.circle} ${currentColors.icon} transition-transform group-hover:scale-110 duration-500`}>
                    {icon}
                </div>
            </div>

            <div className="mt-8 relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400 font-medium">{subtext}</span>
                    {progress !== undefined && <span className="text-sm font-bold text-[#0F172A]">{progress}%</span>}
                </div>
                {progress !== undefined && (
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${color === 'purple' ? 'bg-purple-500' : 'bg-indigo-500'} transition-all duration-1000 ease-out`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* Subtle background decoration */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${currentColors.bg} opacity-50 blur-2xl group-hover:opacity-80 transition-opacity`}></div>
        </div>
    );
}

function getHappinessStatus(score: number) {
    if (score >= 4) return { label: "High", classes: "bg-green-100 text-green-700 border-none" };
    if (score >= 2.5) return { label: "Moderate", classes: "bg-amber-100 text-amber-700 border-none" };
    return { label: "Low", classes: "bg-red-100 text-red-700 border-none" };
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
