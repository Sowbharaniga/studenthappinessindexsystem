
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-md w-full mx-4">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center border border-white/50 relative transform transition-all hover:scale-[1.01] duration-300">

          {/* Decorative Top Gradient */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 to-purple-400"></div>

          {/* Logo / Icon Placeholder */}
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner">
            🎓
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight font-sans">
            Student Happiness Index
          </h1>

          <p className="text-gray-500 mb-10 text-lg leading-relaxed font-light">
            Empowering campus well-being through real-time feedback and analytics.
          </p>

          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center group"
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
              href="/login?view=register"
              className="block w-full bg-white border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200"
            >
              Register Student
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              Admin? <Link href="/admin/login" className="text-indigo-500 hover:text-indigo-600 hover:underline font-medium">Login here</Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8 opacity-60">
          © {new Date().getFullYear()} University Campus System
        </p>
      </div>
    </div>
  );
}
