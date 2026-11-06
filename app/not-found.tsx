
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-bold text-[#164e63]">
        404
      </h1>

      <h2 className="text-2xl font-semibold mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-500 mt-2">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
        href="/"
        className="mt-6 bg-[#164e63] text-white px-6 py-3 rounded-lg hover:bg-[#0f3d4e] transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
