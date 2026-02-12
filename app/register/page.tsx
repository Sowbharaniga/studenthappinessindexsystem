"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        confirmPassword: "",
        departmentId: "", // Will send department NAME as per API logic
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const departments = [
        "Computer Science",
        "Electrical",
        "Mechanical",
        "Civil",
        "Electronics"
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    username: formData.username,
                    password: formData.password,
                    departmentId: formData.departmentId
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            // Successful registration logs the user in automatically
            router.push("/student/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#0f172a,#1e293b)]">
            <div className="bg-[#1e293b] p-8 rounded-[20px] shadow-xl w-full max-w-md border border-white/10">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-sm text-[#94a3b8]">Register as a new student</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 text-sm rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4" autoComplete="off">
                    <div>
                        <label className="block text-sm font-medium text-[#94a3b8] mb-1">
                            Full Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full px-4 py-2 bg-[#334155] border border-[#475569] rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-[#3b82f6] transition-colors placeholder-[#94a3b8] outline-none"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#94a3b8] mb-1">
                            Username / Roll Number
                        </label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full px-4 py-2 bg-[#334155] border border-[#475569] rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-[#3b82f6] transition-colors placeholder-[#94a3b8] outline-none"
                            placeholder="Roll Number"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#94a3b8] mb-1">
                            Department
                        </label>
                        <select
                            name="departmentId"
                            required
                            className="w-full px-4 py-2 bg-[#334155] border border-[#475569] rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-[#3b82f6] transition-colors outline-none"
                            value={formData.departmentId}
                            onChange={handleChange}
                        >
                            <option value="" className="bg-[#1e293b]">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept} className="bg-[#1e293b]">
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#94a3b8] mb-1">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-[#334155] border border-[#475569] rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-[#3b82f6] transition-colors placeholder-[#94a3b8] outline-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#94a3b8] mb-1">
                            Confirm Password
                        </label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-[#334155] border border-[#475569] rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-[#3b82f6] transition-colors placeholder-[#94a3b8] outline-none"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:brightness-110 text-white font-semibold py-2.5 rounded-[10px] transition-colors shadow-lg disabled:opacity-70 mt-2"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-[#94a3b8]">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-[#3b82f6] hover:text-[#60a5fa] hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
