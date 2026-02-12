import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "./_components/SettingsForm";
import Link from "next/link";
import { ChevronRight, LayoutDashboard } from "lucide-react";

export default async function AdminSettingsPage() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
            {/* Header */}
            <header className="sticky top-0 z-30 w-full bg-white border-b border-[#E2E8F0]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
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
                                <Link href="/admin/dashboard" className="hover:text-[#0F172A] transition-colors">Dashboard</Link>
                                <ChevronRight className="w-4 h-4 mx-2 text-[#CBD5E1]" />
                                <span className="text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-md">Settings</span>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
                <SettingsForm />
            </main>
        </div>
    );
}
