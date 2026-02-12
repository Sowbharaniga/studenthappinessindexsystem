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
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="bg-white px-8 py-10 rounded-2xl shadow-xl w-full max-w-[480px] border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Create Account</h1>
                    <p className="text-sm font-medium text-[#64748B]">Register as a new student</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-[#FEF2F2] border border-[#FEE2E2] text-[#EF4444] text-sm font-semibold rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5" autoComplete="off">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#0F172A] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder-gray-400 outline-none font-medium text-sm"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Username / Roll Number
                        </label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#0F172A] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder-gray-400 outline-none font-medium text-sm"
                            placeholder="Enter your roll number"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Department
                        </label>
                        <select
                            name="departmentId"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#0F172A] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-sm appearance-none"
                            value={formData.departmentId}
                            onChange={handleChange}
                        >
                            <option value="" className="bg-white">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept} className="bg-white">
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#0F172A] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder-gray-400 outline-none font-medium text-sm"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#0F172A] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder-gray-400 outline-none font-medium text-sm"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-95 disabled:opacity-70 mt-4"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <div className="mt-8 text-center pt-8 border-t border-[#F1F5F9]">
                    <p className="text-sm font-medium text-[#64748B]">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-[#4F46E5] hover:text-[#4338CA] hover:underline transition-colors">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
