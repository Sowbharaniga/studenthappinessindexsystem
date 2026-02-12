
"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

function AdminLoginForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // STRICTLY ENFORCE ADMIN ONLY
            if (data.role !== "ADMIN") {
                await fetch("/api/auth/logout");
                throw new Error("Access restricted to Administrators.");
            }

            router.push("/admin/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="bg-white p-10 rounded-[24px] shadow-[0_20px_50px_rgba(79,70,229,0.08)] w-full max-w-md border border-[#F1F5F9]">

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#E0E7FF]">
                        <Shield className="w-8 h-8 text-[#4F46E5]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Admin Portal</h1>
                    <p className="text-sm font-medium text-[#64748B]">Secure access for system administrators</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-[#FEF2F2] border border-[#FEE2E2] text-[#EF4444] text-sm font-semibold rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#475569] mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all placeholder-[#94A3B8] outline-none font-medium"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#475569] mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all placeholder-[#94A3B8] outline-none font-medium"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_8px_20px_rgba(79,70,229,0.2)] hover:shadow-[0_12px_24px_rgba(79,70,229,0.3)] disabled:opacity-70 mt-4"
                    >
                        {loading ? "Authenticating..." : "Access Dashboard"}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <Link href="/" className="text-sm font-bold text-[#64748B] hover:text-[#4F46E5] transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
            <AdminLoginForm />
        </Suspense>
    );
}
