
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#0f172a,#1e293b)]">
      <div className="max-w-md w-full mx-4">
        {/* Card */}
        <div className="bg-[#1e293b] rounded-[20px] shadow-xl overflow-hidden p-8 text-center border border-white/10 relative transform transition-all hover:scale-[1.01] duration-300">

          {/* Decorative Top Gradient */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>

          {/* Logo / Icon Placeholder */}
          <div className="w-16 h-16 bg-[#334155] rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner border border-[#475569]">
            🎓
          </div>

          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight font-sans">
            Student Happiness Index
          </h1>

          <p className="text-[#94a3b8] mb-10 text-lg leading-relaxed font-light">
            Empowering campus well-being through real-time feedback and analytics.
          </p>

          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:brightness-110 text-white font-semibold py-3.5 px-6 rounded-[10px] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              Login
              <svg
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/register"
              className="block w-full bg-[#334155] border border-[#475569] text-[#e2e8f0] hover:bg-slate-700 hover:border-slate-500 font-semibold py-3.5 px-6 rounded-[10px] transition-all duration-200 shadow-md"
            >
              Register Student
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-sm text-[#94a3b8]">
              Admin? <Link href="/admin/login" className="text-[#3b82f6] hover:text-[#60a5fa] hover:underline font-medium">Login here</Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-[#94a3b8] text-sm mt-8 opacity-60">
          © {new Date().getFullYear()} University Campus System
        </p>
      </div>
    </div>
  );
}
