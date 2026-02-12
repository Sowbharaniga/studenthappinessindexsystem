"use client";

import { useState } from "react";
import { Bell, Globe, Lock, Save } from "lucide-react";

export default function SettingsForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        summary: true
    });
    const [security, setSecurity] = useState({
        twoFactor: true,
        sessionTimeout: false
    });

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => setIsLoading(false), 1000);
    };

    const toggle = (category: string, key: string) => {
        if (category === 'notifications') {
            setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }));
        } else if (category === 'security') {
            setSecurity(prev => ({ ...prev, [key]: !prev[key as keyof typeof security] }));
        }
    };

    return (
        <>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A]">Settings</h1>
                    <p className="text-[#64748B] mt-1">Manage application preferences and security.</p>
                </div>
                <button
                    onClick={handleSave}
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

            <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-white rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-[#F1F5F9]">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[#4F46E5]" /> General
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-0">
                            <div>
                                <p className="text-sm font-semibold text-[#0F172A]">System Theme</p>
                                <p className="text-xs text-[#64748B]">Customize the look and feel.</p>
                            </div>
                            <select className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] outline-none">
                                <option>Light (Default)</option>
                                <option disabled>Dark (Coming Soon)</option>
                                <option>System</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-0">
                            <div>
                                <p className="text-sm font-semibold text-[#0F172A]">Language</p>
                                <p className="text-xs text-[#64748B]">Select your preferred language.</p>
                            </div>
                            <select className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] outline-none">
                                <option>English (US)</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-[#F1F5F9]">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-[#4F46E5]" /> Notifications
                    </h3>
                    <div className="space-y-4">
                        {Object.keys(notifications).map((key) => (
                            <div key={key} className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-0">
                                <div>
                                    <p className="text-sm font-semibold text-[#0F172A] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()} Notifications</p>
                                    <p className="text-xs text-[#64748B]">Receive updates via {key}.</p>
                                </div>
                                <button
                                    onClick={() => toggle('notifications', key)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 ${notifications[key as keyof typeof notifications] ? 'bg-[#4F46E5]' : 'bg-[#E2E8F0]'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-[#F1F5F9]">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-[#4F46E5]" /> Security
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-0">
                            <div>
                                <p className="text-sm font-semibold text-[#0F172A]">Two-Factor Authentication</p>
                                <p className="text-xs text-[#64748B]">Add an extra layer of security.</p>
                            </div>
                            <button
                                onClick={() => toggle('security', 'twoFactor')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 ${security.twoFactor ? 'bg-[#4F46E5]' : 'bg-[#E2E8F0]'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${security.twoFactor ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-0">
                            <div>
                                <p className="text-sm font-semibold text-[#0F172A]">Auto Session Timeout</p>
                                <p className="text-xs text-[#64748B]">Log out after inactivity.</p>
                            </div>
                            <button
                                onClick={() => toggle('security', 'sessionTimeout')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 ${security.sessionTimeout ? 'bg-[#4F46E5]' : 'bg-[#E2E8F0]'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${security.sessionTimeout ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
