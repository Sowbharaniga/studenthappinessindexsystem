
"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function LoginForm() {
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
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            let data;
            try {
                data = await res.json();
            } catch {
                throw new Error("Server returned invalid response");
            }

            if (!res.ok) {
                throw new Error(data?.error || "Login failed");
            }

            // STRICTLY ENFORCE STUDENT ONLY
            if (data.role === "ADMIN") {
                // In a real secure app, we might handle this server-side, but client-check works for UI feedback
                // We technically logged them in (cookie set), so we should probably logout or show error.
                // For this specific requirement "Admin users must not be able to log in from this page",
                // we show error. Ideally we'd call logout immediately.
                await fetch("/api/auth/logout"); // Invalidate session immediately
                throw new Error("This login is for Students only.");
            }

            router.push("/student/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#EEF2FF,30%,#BAE6FD)]">
            <div className="bg-white p-10 rounded-[24px] shadow-[0_20px_50px_rgba(79,70,229,0.1)] w-full max-w-sm border border-white">

                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Welcome Back</h1>
                    <p className="text-sm font-medium text-[#64748B]">Sign in to access your student dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-[#FEF2F2] border border-[#FEE2E2] text-[#EF4444] text-sm font-semibold rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#475569] mb-2">
                            Username / Roll Number
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all placeholder-[#94A3B8] outline-none font-medium"
                            placeholder="Enter your roll number"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_8px_20px_rgba(79,70,229,0.2)] hover:shadow-[0_12px_24px_rgba(79,70,229,0.3)] disabled:opacity-70 mt-4"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 text-center pt-8 border-t border-[#F1F5F9]">
                    <p className="text-sm font-medium text-[#64748B]">
                        Don’t have an account?{" "}
                        <Link href="/register" className="font-bold text-[#4F46E5] hover:text-[#4338CA] hover:underline transition-colors">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
