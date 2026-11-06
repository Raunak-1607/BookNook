"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BookOpenCheck, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { GetTokenFromClient } from "@/lib/GetTokenFromClient";
import { BACKEND_URL } from "@/lib/api";

type BorrowRecord = {
  _id: string;
  bookId: string;
  bookTitle: string;
  borrowDate?: string;
  status: "Borrowed" | "Returned";
  bookImage?: string | null;
  bookCategory?: string | null;
};

type BookDetails = {
  image?: string | null;
  category?: string | null;
};

type BorrowedBook = BorrowRecord & {
  image?: string | null;
  category?: string | null;
};

// const API_URL = "http://localhost:5000";

async function addBookDetails(
  records: BorrowRecord[],
): Promise<BorrowedBook[]> {
  const activeRecords = records.filter(
    (record) => record.status === "Borrowed",
  );

  // Older borrow records may not contain the image/category. Fill those
  // fields from the original book document when they are still available.
  return Promise.all(
    activeRecords.map(async (record) => {
      if (record.bookImage && record.bookCategory) {
        return {
          ...record,
          image: record.bookImage,
          category: record.bookCategory,
        };
      }

      try {
        const bookResponse = await fetch(
          `${BACKEND_URL}/books/detail/${record.bookId}`,
        );
        const book: BookDetails = bookResponse.ok
          ? await bookResponse.json()
          : {};

        return {
          ...record,
          image: record.bookImage ?? book.image,
          category: record.bookCategory ?? book.category,
        };
      } catch {
        return {
          ...record,
          image: record.bookImage,
          category: record.bookCategory,
        };
      }
    }),
  );
}

export default function MyBorrowsPage() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;

    let isCurrentRequest = true;

    GetTokenFromClient()
      .then((token) =>
        fetch(`${BACKEND_URL}/borrowed-books/${encodeURIComponent(email)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load borrowed books.");
        }

        const records: BorrowRecord[] = await response.json();
        return addBookDetails(records);
      })
      .then((books) => {
        if (isCurrentRequest) setBorrowedBooks(books);
      })
      .catch((error) => {
        if (!isCurrentRequest) return;
        console.error(error);
        toast.error("Unable to load your borrowed books.");
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [email]);

  const handleReturn = async (borrowedBook: BorrowedBook) => {
    const token = await GetTokenFromClient().catch(() => "");
    if (!email || returningId) return;

    setReturningId(borrowedBook._id);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BACKEND_URL}/borrowed-books/${borrowedBook._id}/return`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not return this book.");
      }

      // The backend has incremented books.copies. Remove the now-returned
      // record from the active-loans view without requiring a page refresh.
      setBorrowedBooks((currentBooks) =>
        currentBooks.filter((book) => book._id !== borrowedBook._id),
      );
      toast.success(`“${borrowedBook.bookTitle}” was returned successfully.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not return this book.",
      );
    } finally {
      setReturningId(null);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-[#f5f8f7] px-4 py-10">
        <div className="mx-auto max-w-5xl animate-pulse space-y-5">
          <div className="h-10 w-48 rounded bg-gray-200" />
          <div className="h-48 rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-[#f5f8f7] px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#104e5b]">My Borrows</h1>
        <p className="mt-2 text-gray-600">Please log in to view your books.</p>
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-140px)] bg-[#f5f8f7] px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wider text-[#b68339] uppercase">
              Your library
            </p>
            <h1 className="mt-1 text-3xl font-bold text-[#104e5b]">
              My Borrows
            </h1>
            <p className="mt-2 text-gray-600">
              Return a book when you are finished so another reader can borrow
              it.
            </p>
          </div>
          <div className="rounded-full bg-[#e5f3f0] px-4 py-2 text-sm font-semibold text-[#104e5b]">
            {borrowedBooks.length} active{" "}
            {borrowedBooks.length === 1 ? "loan" : "loans"}
          </div>
        </div>

        {borrowedBooks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#104e5b]/25 bg-white px-6 py-16 text-center shadow-sm">
            <BookOpenCheck className="mx-auto size-11 text-[#b68339]" />
            <h2 className="mt-4 text-xl font-bold text-[#104e5b]">
              No active borrows
            </h2>
            <p className="mt-2 text-gray-600">
              Books you borrow will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {borrowedBooks.map((book) => {
              const imageSrc = book.image?.trim();
              const borrowedDate = book.borrowDate
                ? new Date(book.borrowDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Date unavailable";

              return (
                <article
                  key={book._id}
                  className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5"
                >
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-[#104e5b] shadow-sm">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={`${book.bookTitle} cover`}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center px-2 text-center text-sm font-bold text-white">
                        {book.bookTitle.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold tracking-wider text-[#b68339] uppercase">
                      {book.category || "Uncategorized"}
                    </p>
                    <h2 className="mt-1 truncate text-xl font-bold text-[#104e5b]">
                      {book.bookTitle}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Borrowed on {borrowedDate}
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="lg"
                    disabled={returningId !== null}
                    onClick={() => void handleReturn(book)}
                    className="h-11 shrink-0 bg-[#b68339] px-5 font-semibold text-white hover:bg-[#a1712c]"
                  >
                    <RotateCcw data-icon="inline-start" />
                    {returningId === book._id ? "Returning..." : "Return book"}
                  </Button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
