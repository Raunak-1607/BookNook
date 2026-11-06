import Link from "next/link";
import { Compass, Home, LogIn } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100dvh-120px)] sm:min-h-[calc(100vh-140px)] flex flex-col items-center justify-center bg-[#f5f8f7] px-4 py-8 sm:py-16">
      <div className="w-full max-w-sm sm:max-w-md text-center bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10 transition-all">
        {/* Icon Badge */}
        <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-[#104e5b]/10 text-[#104e5b] mb-4 sm:mb-6">
          <Compass className="h-8 w-8 sm:h-10 sm:w-10 text-[#104e5b]" />
        </div>

        {/* Status Code */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-[#104e5b]">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-2 sm:mt-3 text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
          Page Not Found
        </h2>

        {/* Message */}
        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
          Sorry, the page you are looking for doesn&apos;t exist, has been removed, or requires authentication.
        </p>

        {/* Action Buttons - Stacked on mobile, side-by-side on sm+ */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
          <Link
            href="/"
            className="w-full flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#104e5b] hover:bg-[#0c3e48] active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition"
          >
            <Home className="h-4 w-4 shrink-0" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/Auth/Login"
            className="w-full flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.98] text-gray-700 text-sm font-semibold shadow-xs transition"
          >
            <LogIn className="h-4 w-4 shrink-0" />
            <span>Log In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
