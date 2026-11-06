"use client";

import { useEffect, useState } from "react";
import MyBookCardPage from "@/components/MyBookCard";
import { authClient } from "@/lib/auth-client";
import { BookType } from "@/lib/Type/Type";
import { GetTokenFromClient } from "@/lib/GetTokenFromClient";
import { BACKEND_URL } from "@/lib/api";
import Link from "next/link";
import { PlusCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const MyBooksPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;

    let isMounted = true;

    GetTokenFromClient()
      .catch(() => "")
      .then((token) => {
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        return fetch(`${BACKEND_URL}/books/${encodeURIComponent(email)}`, {
          headers,
        });
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not load your books.");
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data)) {
            setBooks(data);
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error("Error loading books:", error);
          setErrorMessage(
            error instanceof Error ? error.message : "Could not load your books.",
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [email]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-[#104e5b] border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">Loading your books...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xs max-w-md">
          <BookOpen className="mx-auto size-12 text-[#104e5b]/40 mb-3" />
          <h2 className="text-xl font-bold text-[#1a4852]">Authentication Required</h2>
          <p className="mt-2 text-sm text-gray-500">Please log in to view and manage the books you have added.</p>
          <Link href="/Auth/Login" className="mt-5 inline-block">
            <Button className="bg-[#104e5b] text-white hover:bg-[#0c3e49]">
              Log In Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header section with responsive title & Add Book CTA */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a4852] sm:text-3xl md:text-4xl">
            My Books
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Manage and update the books you have contributed to BookNook.
          </p>
        </div>

        <Link href="/Add-Books" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#104e5b] text-white hover:bg-[#0c3e49] shadow-sm">
            <PlusCircle className="size-4" />
            <span>Add New Book</span>
          </Button>
        </Link>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center sm:p-14">
          <div className="flex size-14 items-center justify-center rounded-full bg-[#e5f3f0] text-[#104e5b] mb-4">
            <BookOpen className="size-7" />
          </div>
          <h3 className="text-lg font-bold text-[#183b43]">No books added yet</h3>
          <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-gray-500">
            You haven&apos;t added any books to the library yet. Start by adding your first book.
          </p>
          <Link href="/Add-Books" className="mt-5">
            <Button className="bg-[#104e5b] text-white hover:bg-[#0c3e49]">
              Add Your First Book
            </Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
          {/* Desktop/Tablet Column Headers (>= 768px) */}
          <div className="hidden md:grid md:grid-cols-5 bg-gray-50/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200 gap-4">
            <p>Cover</p>
            <p>Title & Author</p>
            <p>Category</p>
            <p>Added Date</p>
            <p>Actions</p>
          </div>

          {/* Book Cards / Rows */}
          <div className="divide-y divide-gray-100">
            {books.map((book) => (
              <MyBookCardPage
                key={book._id}
                book={book}
                onBookUpdated={(updatedBook) =>
                  setBooks((currentBooks) =>
                    currentBooks.map((currentBook) =>
                      currentBook._id === updatedBook._id ? updatedBook : currentBook,
                    ),
                  )
                }
                onBookDeleted={(deletedId) =>
                  setBooks((currentBooks) =>
                    currentBooks.filter((currentBook) => currentBook._id !== deletedId),
                  )
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooksPage;
