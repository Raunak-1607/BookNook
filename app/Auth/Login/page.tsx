import React from 'react';
import Link from "next/link";

const LoginPage = () => {
    return (
      <main className="flex min-h-[85vh] items-center justify-center bg-[#f5f8f7] px-4 py-8">

      {/* Login Card */}
      <div className="w-full max-w-[594px] rounded-[20px] border border-[#e0e7e4] bg-white p-6 shadow-sm sm:p-10">

        {/* Heading */}
        <h1 className="mb-5 text-4xl font-bold text-[#104e5b]">
          Login
        </h1>

        <form className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-lg font-medium text-[#172b30]"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-[56px] w-full rounded-xl border border-[#d5dfdc] px-4 text-base text-[#52666b] outline-none transition focus:border-[#104e5b] focus:ring-1 focus:ring-[#104e5b]"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-lg font-medium text-[#172b30]"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••"
              required
              className="h-[56px] w-full rounded-xl border border-[#d5dfdc] px-4 text-base text-[#52666b] outline-none transition focus:border-[#104e5b] focus:ring-1 focus:ring-[#104e5b]"
            />
          </div>

         
          {/* Login Button */}
          <button
            type="button"
            className="h-[55px] w-full rounded-xl bg-[#104e5b] text-lg font-bold text-white transition duration-300 hover:bg-[#0b414d]"
          >
            Login
          </button>

          {/* Google Button */}
          <button
            type="button"
            className="h-[58px] w-full rounded-xl border-2 border-[#104e5b] bg-white text-lg font-bold text-[#104e5b] transition duration-300 hover:bg-[#f0f6f4]"
          >
            <span className="mr-2 text-xl font-bold">G</span>
            Continue with Google
          </button>

        </form>

        {/* Register Link */}
        <p className="mt-5 text-base text-[#65767b]">
          New here?{" "}
          <Link
            href="/Auth/Register"
            className="font-medium transition hover:text-[#104e5b] hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </main>
    );
};

export default LoginPage;