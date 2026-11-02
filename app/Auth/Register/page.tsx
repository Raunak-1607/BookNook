// import { Link } from 'lucide-react';
import Link from "next/link";
import React from 'react';

const RegisterPage = () => {
    return (
         <main className="flex min-h-[85vh] items-center justify-center bg-[#f5f8f7] px-4 py-8">

      <div className="w-full max-w-[534px] rounded-[20px] border border-[#e0e7e4] bg-white p-6 shadow-sm sm:p-9">

        {/* Heading */}
        <h1 className="mb-5 text-4xl font-bold text-[#104e5b]">
          Register
        </h1>

        <form className="space-y-4">

          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-2 block font-medium text-[#172b30]">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              required
              className="h-[52px] w-full rounded-xl border border-[#d5dfdc] px-3 text-base outline-none transition focus:border-[#104e5b] focus:ring-1 focus:ring-[#104e5b]"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block font-medium text-[#172b30]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-[52px] w-full rounded-xl border border-[#d5dfdc] px-3 text-base outline-none transition focus:border-[#104e5b] focus:ring-1 focus:ring-[#104e5b]"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label htmlFor="photoURL" className="mb-2 block font-medium text-[#172b30]">
              Photo URL
            </label>
            <input
              id="photoURL"
              name="photoURL"
              type="url"
              placeholder="https://"
              className="h-[52px] w-full rounded-xl border border-[#d5dfdc] px-3 text-base outline-none transition focus:border-[#104e5b] focus:ring-1 focus:ring-[#104e5b]"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-2 block font-medium text-[#172b30]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••"
              required
              className="h-[52px] w-full rounded-xl border border-[#d5dfdc] px-3 text-base outline-none transition focus:border-[#104e5b] focus:ring-1 focus:ring-[#104e5b]"
            />

            <p className="mt-3 text-sm leading-5 text-[#65767b]">
              Use 6+ characters with one uppercase and one lowercase letter.
            </p>
          </div>

          {/* Register Button */}
          <button
            type="button"
            className="h-[50px] w-full rounded-xl bg-[#104e5b] text-base font-bold text-white transition hover:bg-[#0b414d]"
          >
            Register
          </button>

          {/* Google Button */}
          <button
            type="button"
            className="h-[52px] w-full rounded-xl border-2 border-[#104e5b] bg-white text-base font-bold text-[#104e5b] transition hover:bg-[#f0f6f4]"
          >
            <span className="mr-2 text-xl font-bold">G</span>
            Continue with Google
          </button>

        </form>

        {/* Login Link */}
       <p className="mt-4 text-center text-sm text-[#65767b]">
        Already have an account? {"   "}
        <Link href="/Auth/Login" className="font-medium text-[#104e5b] hover:underline">
        Login here</Link>

      </p>
      </div>
    </main>
    );
};

export default RegisterPage;