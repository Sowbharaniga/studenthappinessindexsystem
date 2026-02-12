
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
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
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
        <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#0f172a,#1e293b)]">
            <div className="bg-[#1e293b] p-8 rounded-[20px] shadow-xl w-full max-w-sm border border-white/10">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-sm text-[#94a3b8]">Sign in to access your student dashboard</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 text-sm rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[#94a3b8] mb-1">
                            Username / Roll Number
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 bg-[#334155] border border-[#475569] rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-[#3b82f6] transition-colors placeholder-[#94a3b8] outline-none"
                            placeholder="Enter your roll number"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#94a3b8] mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-[#334155] border border-[#475569] rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-[#3b82f6] transition-colors placeholder-[#94a3b8] outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:brightness-110 text-white font-semibold py-2.5 rounded-[10px] transition-all shadow-lg disabled:opacity-70"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-[#94a3b8]">
                        Don’t have an account?{" "}
                        <Link href="/register" className="font-medium text-[#3b82f6] hover:text-[#60a5fa] hover:underline">
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
