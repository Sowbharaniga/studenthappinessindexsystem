"use client";

import { useState } from "react";
import { UserCircle, Mail, Shield, Save, Camera } from "lucide-react";

interface ProfileFormProps {
    adminUser: {
        name: string | null;
        username: string;
    } | undefined;
}

export default function ProfileForm({ adminUser }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const adminName = adminUser?.name || "System Admin";
    const adminEmail = adminUser?.username ? (adminUser.username.includes('@') ? adminUser.username : `${adminUser.username}@system.com`) : "admin@system.com";

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Profile Card */}
            <div className="col-span-1">
                <div className="bg-white rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-[#F1F5F9] text-center">
                    <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mx-auto mb-4 ring-4 ring-white shadow-sm">
                            <UserCircle className="w-12 h-12" />
                        </div>
                        <button className="absolute bottom-4 right-0 p-1.5 bg-[#4F46E5] text-white rounded-full shadow-sm hover:bg-[#4338CA] transition-colors">
                            <Camera className="w-3 h-3" />
                        </button>
                    </div>
                    <h2 className="text-lg font-bold text-[#0F172A]">{adminName}</h2>
                    <p className="text-sm text-[#64748B] mb-4">{adminEmail}</p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#166534] text-xs font-semibold">
                        <Shield className="w-3 h-3" />
                        Super Admin
                    </div>
                </div>
            </div>

            {/* Right Column: Edit Form */}
            <div className="col-span-1 md:col-span-2">
                <div className="bg-white rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-[#F1F5F9]">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-6 border-b border-[#F1F5F9] pb-4">Personal Information</h3>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[#0F172A] mb-2">Display Name</label>
                                <input
                                    type="text"
                                    defaultValue={adminName}
                                    className="w-full px-4 py-2 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0F172A] mb-2">Email Address / Username</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                                <input
                                    type="email"
                                    defaultValue={adminEmail}
                                    disabled
                                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] text-sm cursor-not-allowed"
                                />
                            </div>
                            <p className="mt-1 text-xs text-[#94A3B8]">Email address cannot be changed for admin accounts.</p>
                        </div>

                        <div className="pt-4 border-t border-[#F1F5F9] flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>Saving...</>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
