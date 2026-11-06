
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookCard, { type BookCardProps } from "@/components/BookCard";
import { BACKEND_URL } from "@/lib/api";

type Book = BookCardProps["book"] & {
  createdAt?: string;
};

export default function RecentBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/books`);
        if (!res.ok) {
          throw new Error(`Failed to fetch books: ${res.status}`);
        }
        const data = await res.json();

        if (Array.isArray(data)) {
          // Sort newest books first
          const recentBooks = [...data]
            .sort((a, b) => {
              const dateA =
                Date.parse(a.createdAt || "") ||
                (a._id && a._id.length >= 8
                  ? parseInt(a._id.slice(0, 8), 16) * 1000
                  : 0);

              const dateB =
                Date.parse(b.createdAt || "") ||
                (b._id && b._id.length >= 8
                  ? parseInt(b._id.slice(0, 8), 16) * 1000
                  : 0);

              return dateB - dateA;
            })
            .slice(0, 7);

          setBooks(recentBooks);
        }
      } catch (error) {
        console.error("Failed to load recent books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="bg-[#f5f8f7] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#b68339]">
              Fresh on the shelf
            </p>

            <h2 className="mt-1 text-3xl font-bold text-[#104e5b]">
              Recently Added Books
            </h2>
          </div>

          <Link
            href="/All-Books"
            className="shrink-0 text-sm font-semibold text-[#104e5b] hover:underline"
          >
            View all books
          </Link>
        </div>

        {loading ? (
          <p className="py-10 text-center text-gray-500">
            Loading books...
          </p>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#104e5b]/25 bg-white px-6 py-12 text-center text-gray-600">
            No books have been added yet.
          </div>
        )}

      </div>
    </section>
  );
}
