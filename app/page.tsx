
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#EEF2FF,30%,#BAE6FD)]">
      <div className="max-w-md w-full mx-4">
        {/* Card */}
        <div className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(79,70,229,0.1)] overflow-hidden p-10 text-center border border-white relative transform transition-all hover:scale-[1.01] duration-300">

          {/* Decorative Top Gradient */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4F46E5] to-[#0EA5E9]"></div>

          {/* Logo / Icon Placeholder */}
          <div className="w-20 h-20 bg-[#F1F5F9] rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-inner border border-[#E2E8F0]">
            🎓
          </div>

          <h1 className="text-3xl font-extrabold text-[#0F172A] mb-4 tracking-tight font-sans">
            Student Happiness <span className="text-[#4F46E5]">Index</span>
          </h1>

          <p className="text-[#64748B] mb-12 text-lg leading-relaxed font-medium">
            Empowering campus well-being through real-time feedback and analytics.
          </p>

          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-4 px-6 rounded-[14px] transition-all duration-200 shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_24px_rgba(79,70,229,0.4)] flex items-center justify-center group"
            >
              Get Started
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/register"
              className="block w-full bg-white border-2 border-[#E2E8F0] text-[#4F46E5] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] font-bold py-4 px-6 rounded-[14px] transition-all duration-200"
            >
              New Student? Register
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-[#F1F5F9]">
            <p className="text-sm font-medium text-[#94A3B8]">
              Administrator? <Link href="/admin/login" className="text-[#4F46E5] hover:text-[#4338CA] hover:underline font-bold transition-colors">Login here</Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-[#64748B] text-sm mt-8 font-medium">
          © {new Date().getFullYear()} University Campus System
        </p>
      </div>
    </div>
  );
}
